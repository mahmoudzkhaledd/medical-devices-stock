import { z, ZodTypeAny } from "zod";
import { getSession } from "./auth";

type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      type: "validation" | "server";
      error: string;
    };

export function withAuth<
  TSchema extends ZodTypeAny | null,
  TInput = TSchema extends ZodTypeAny ? z.infer<TSchema> : unknown,
  TReturn = unknown,
>(
  schema: TSchema,
  fn: (args: {
    input: TInput;
    session: NonNullable<Awaited<ReturnType<typeof getSession>>>;
  }) => Promise<TReturn>,
) {
  return async (input: unknown): Promise<Result<Awaited<TReturn>>> => {
    try {
      const session = await getSession();

      if (!session?.user) {
        return {
          success: false,
          type: "server",
          error: "Please signin first",
        };
      }

      let parsedInput: TInput;

      if (schema) {
        const parsed = schema.safeParse(input);

        if (!parsed.success) {
          return {
            success: false,
            type: "validation",
            error:
              parsed.error.issues.length == 0
                ? "Unknown error occured, please contact the technical support."
                : parsed.error.issues[0].message,
          };
        }

        parsedInput = parsed.data as TInput;
      } else {
        parsedInput = input as TInput;
      }

      const data = await fn({
        input: parsedInput,
        session,
      });

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      if ((error as Error).message == "NEXT_REDIRECT") {
        throw error;
      }

      return {
        success: false,
        type: "server",
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ غير متوقع، يرجى اعادة المحاولة لاحقا او التواصل مع الدعم الفني",
      };
    }
  };
}
