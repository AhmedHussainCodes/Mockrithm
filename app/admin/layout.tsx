"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/firebase/client"; // your firebase client auth instance
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminNavbar } from "@/components/admin-navbar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/sign-in"); // redirect if not logged in
      } else {
        setLoading(false); // user logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!loading) {
      const tl = gsap.timeline();

      tl.fromTo(
        ".page-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      return () => {
        tl.kill();
      };
    }
  }, [pathname, loading]);

  if (loading) {
    // optional: loading spinner or blank screen while checking auth
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminNavbar />
        <main className="page-content px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
