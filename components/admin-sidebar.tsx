"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { auth } from "@/firebase/client";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  ListChecks,
  ClipboardList,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Globe,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock Firebase functions for demo
const mockAuth: { currentUser: null | { uid: string } } = {
  currentUser: { uid: "demo-uid" },
};
const mockGetDoc = async () => ({
  exists: () => true,
  data: () => ({
    name: "Admin",
    profileImage: "public/admin.png",
    maintenance: false,
  }),
});
const mockUpdateDoc = async () => {};

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Interviews", href: "/admin/interviews", icon: ListChecks }, // single link
  {
    name: "Interview Feedback",
    href: "/admin/interviewfeedback",
    icon: ClipboardList,
  },
  { name: "Feedback", href: "/admin/feedback", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState("");
  const [adminImage, setAdminImage] = useState("");
  const [maintenance, setMaintenance] = useState(false);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);
  const [adminSectionOpen, setAdminSectionOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      ".sidebar-item",
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      }
    );

    const fetchAdminData = async () => {
      const user = mockAuth.currentUser;
      if (!user) return;

      try {
        const snap = await mockGetDoc();
        if (snap.exists()) {
          const data = snap.data();
          setAdminName(data?.name || "Admin");
          setAdminImage(data?.profileImage || "");
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    };

    fetchAdminData();

    const fetchMaintenanceStatus = async () => {
      try {
        const snap = await mockGetDoc();
        if (snap.exists()) setMaintenance(snap.data()?.maintenance || false);
      } catch (err) {
        console.error("Failed to fetch maintenance status:", err);
      } finally {
        setLoadingMaintenance(false);
      }
    };

    fetchMaintenanceStatus();
  }, []);

  const toggleMaintenance = async () => {
    try {
      setLoadingMaintenance(true);
      await mockUpdateDoc();
      setMaintenance(!maintenance);
    } catch (err) {
      console.error("Failed to toggle maintenance:", err);
    } finally {
      setLoadingMaintenance(false);
    }
  };

const handleLogout = async () => {
  try {
    await auth.signOut();        // Log out properly
    router.push("/sign-in");     // Then navigate to sign-in
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  const SidebarContent = () => (
    <Card
      className={cn(
        "h-full bg-black border-r border-white/10 rounded-none shadow-none transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <CardContent className="flex flex-col h-full p-0">
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/10">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10 ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.name}>
                  <div
                    className={cn(
                      "sidebar-item flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer hover:bg-white/10",
                      isActive
                        ? "bg-white/10 text-white shadow"
                        : "text-gray-400 hover:text-white",
                      isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div
                      className={cn(
                        "flex items-center",
                        isCollapsed && "justify-center"
                      )}
                    >
                      {item.icon && (
                        <item.icon
                          className={cn(
                            "h-5 w-5 flex-shrink-0",
                            !isCollapsed && "mr-3"
                          )}
                        />
                      )}
                      {!isCollapsed && (
                        <Link href={item.href} className="w-full">
                          {item.name}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="border-t border-white/10 p-4">
          <div
            className={cn(
              "sidebar-item flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer hover:bg-white/10",
              adminSectionOpen
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white",
              isCollapsed && "justify-center"
            )}
            onClick={() =>
              !isCollapsed && setAdminSectionOpen(!adminSectionOpen)
            }
            title={isCollapsed ? adminName || "Admin" : undefined}
          >
            <div
              className={cn(
                "flex items-center space-x-3",
                isCollapsed && "space-x-0 justify-center"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={adminImage || "/placeholder.svg"}
                  alt={adminName}
                />
                <AvatarFallback className="bg-white/10 text-white">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <span className="truncate">{adminName || "Admin"}</span>
              )}
            </div>
          </div>

          {adminSectionOpen && !isCollapsed && (
            <div className="mt-2 space-y-1 ml-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => router.push("/")}
              >
                <Globe className="mr-2 h-4 w-4" />
                Visit Website
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                onClick={toggleMaintenance}
                disabled={loadingMaintenance}
              >
                {loadingMaintenance ? (
                  <span className="text-gray-400">Loading...</span>
                ) : maintenance ? (
                  <span className="text-red-400 font-medium">
                    Disable Maintenance
                  </span>
                ) : (
                  <span className="text-green-400 font-medium">
                    Enable Maintenance
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300",
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-black/50 backdrop-blur-sm border border-white/10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-black border-white/10">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
