import * as z from "zod";

export const authSchema = z.object({
  username: z
    .string({ message: "Please enter a valid username." })
    .min(5, { message: "Username is at least 5 characters." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export type AuthFormValues = z.infer<typeof authSchema>;
