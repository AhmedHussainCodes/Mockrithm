"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { Bell, Search, LogOut, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, db } from "@/firebase/client";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

export function AdminNavbar() {
  const [adminName, setAdminName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Fetch admin name from Firestore
  useEffect(() => {
    const fetchAdminName = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setAdminName(data.name || "Admin");
        }
      } catch (error) {
        console.error("Failed to fetch admin name:", error);
      }
    };
    fetchAdminName();
  }, []);

  // GSAP animation
  useEffect(() => {
    gsap.fromTo(
      ".navbar-item",
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Search */}
        <div className="navbar-item flex items-center space-x-4 lg:ml-0 ml-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-64 bg-white/5 border-white/10 pl-10 focus:border-white/20"
            />
          </div>
        </div>

        {/* Icons & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="navbar-item relative bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
          </Button>

          <div
            className="
    cursor-pointer
    px-4 py-2
    rounded-lg
    border border-white/60
    hover:shadow-lg
    hover:border-gray-300
    transition
    duration-200
    text-white
    font-medium
    text-center
    select-none
  "
            onClick={() => console.log("Clicked")}
          >
            {adminName || "Admin"}
          </div>
        </div>
      </div>
    </header>
  );
}
