"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); // ✅ Toggle state

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

 const onSubmit = async (data: z.infer<typeof formSchema>) => {
  try {
    if (type === "sign-up") {
      const { name, email, password } = data;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const result = await signUp({
        uid: userCredential.user.uid,
        name: name!,
        email,
        password,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Account created successfully. Please sign in.");
      router.push("/sign-in");

    } else {
      const { email, password } = data;

      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        if (err.code === "auth/user-not-found") {
          toast.error("User not found. Please sign up first.");
        } else if (err.code === "auth/wrong-password") {
          toast.error("Incorrect password.");
        } else if (err.code === "auth/invalid-email") {
          toast.error("Invalid email format.");
        } else {
          toast.error(`Login failed: ${err.message}`);
        }
        return;
      }

      const idToken = await userCredential.user.getIdToken();
      if (!idToken) {
        toast.error("Sign in Failed. Please try again.");
        return;
      }

      await signIn({
        email,
        idToken,
      });

      toast.success("Signed in successfully.");

      if (email === "ahmed@gmail.com") {
        localStorage.setItem("isAdmin", "true");
        router.push("/");
      } else {
        localStorage.removeItem("isAdmin");
        router.push("/");
      }

      router.refresh();
    }
  } catch (error) {
    console.error(error);
    toast.error(`There was an error: ${error}`);
  }
};


  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Mockrithm</h2>
        </div>

        <h3 className="text-center">Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
            />
{isSignIn && (
  <div className="text-sm text-right">
    <Link
      href="/forgot-password"
      className="text-user-primary hover:underline"
    >
      Forgot Password?
    </Link>
  </div>
)}            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;