"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // ✅ Import toast

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const verifyCodeSchema = z.object({
  email: z.string().email("Enter a valid email"),
  code: z.string().min(6, "6-digit code required").max(6),
});

export default function VerifyCodePage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { email: "", code: "" },
  });

  const onSubmit = async (values: z.infer<typeof verifyCodeSchema>) => {
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Code verified! Redirecting...");
        setTimeout(() => {
          router.push(`/reset-password?email=${values.email}`);
        }, 1500);
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Verify Code</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your email"
                    className="text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="6-digit code"
                    maxLength={6}
                    className="bg-gray-100 text-white tracking-widest"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Verify Code
          </Button>
        </form>
      </Form>
    </div>
  );
}
