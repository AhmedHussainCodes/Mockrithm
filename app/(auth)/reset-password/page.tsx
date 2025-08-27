"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner"; // ✅ Added Sonner toast

const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: data.password }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Password reset successful. Redirecting...");
        setTimeout(() => router.push("/sign-in"), 500);
      } else {
        toast.error(result.message || "Password reset failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded text-white">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <p className="text-sm mb-4">
        Reset password for <strong>{email}</strong>
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      {...field}
                      className="pr-10"
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
