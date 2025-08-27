import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Toaster } from "sonner";

import AuthLayout from "@/components/Authlayout";
import FooterWrapper from "@/components/shared/FooterWrapper";

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mockrithm",
  description: "An AI-powered platform for mock interviews and admin control",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className} bg-black text-white antialiased pattern`}
      >
        <AuthLayout>{children}</AuthLayout>
        <Toaster />
        <FooterWrapper />
      </body>
    </html>
  );
}
