"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { AuthFormValues, authSchema } from "@/types/schema/login.schema";
import CustomFormField, {
  FormFieldType,
} from "@/components/general/custom-form-field";
import { authClient } from "@/lib/auth-client";
import { useLoading } from "@/components/hooks/useLoading";
import { toast } from "sonner";
export function AuthForm({ className, ...props }: React.ComponentProps<"div">) {
  const { loading, startLoading } = useLoading();
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: AuthFormValues) {
    startLoading(async () => {
      try {
        const res = await authClient.signIn.username({
          username: values.username,
          password: values.password,
          rememberMe: true,
          callbackURL: "/dashboard/home",
        });
        console.log(res);
        if (res.error && res.error.message) {
          toast.error(res.error.message);
          return;
        }
        if (res.data?.url) {
          window.location.href = res.data?.url;
          return;
        }
      } catch (ex) {}
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
          </div>
          <h1 className="text-xl font-bold">Welcome to MDM.</h1>
        </div>

        <CustomFormField
          control={form.control}
          name="username"
          fieldType={FormFieldType.INPUT}
          label="Username"
          placeholder="user123"
        />

        <CustomFormField
          control={form.control}
          name="password"
          fieldType={FormFieldType.INPUT}
          inputType="password"
          label="Password"
          placeholder="••••••••"
        />

        <Button loading={loading} type="submit" className="mt-2 w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
