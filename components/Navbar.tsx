"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/client";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import Image from "next/image";
import {
  doc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
  Trash2,
  User,
  Home,
  Info,
  Mail,
} from "lucide-react";

interface NavbarProps {
  userId: string;
  userName: string;
}

const Navbar = ({ userId, userName }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userId) return;
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setIsAdmin(data.role === "admin");
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };
    fetchUserRole();
  }, [userId]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    )
      return;
    try {
      const interviewsRef = collection(db, "users", userId, "interviews");
      const interviewDocs = await getDocs(interviewsRef);
      await Promise.all(interviewDocs.docs.map((doc) => deleteDoc(doc.ref)));
      await deleteDoc(doc(db, "users", userId));
      const currentUser = auth.currentUser;
      if (currentUser) await currentUser.delete();
      await signOut(auth);
      router.push("/sign-in");
    } catch (error) {
      console.error("Account deletion failed:", error);
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-mona-sans ${
          isScrolled
            ? "bg-black/95 backdrop-blur-md shadow-2xl border-b border-white/20"
            : "bg-black/80 backdrop-blur-sm"
        }`}
        style={{
          backgroundImage: "url('/pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      >
        <div className="absolute inset-0 bg-black/90" />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="relative flex items-center h-16 justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
              aria-label="Mockrithm Home"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-lg blur opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative bg-white/10 p-2 rounded-lg border border-white/20 group-hover:border-white/40 transition-colors duration-300 backdrop-blur-sm">
                  <Image
                    src="/logo.svg"
                    alt="Mockrithm Logo"
                    width={28}
                    height={28}
                    priority
                    className="w-7 h-7"
                  />
                </div>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[17px] font-bold text-white group-hover:text-gray-200 transition-colors duration-300">
                  MOCKRITHM
                </span>
                <span className="text-[12px] font-medium text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  Face the Machine
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "text-white bg-white/10"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="text-sm">{link.label}</span>
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] w-full bg-white transition-transform duration-300 origin-center ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Desktop User Dropdown */}
            <div className="hidden md:flex items-center ml-auto">
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-gray-300 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-sm max-w-24 truncate">
                      {userName}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 py-2 z-10 animate-in slide-in-from-top-2 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-white/20">
                      <p className="text-sm font-medium text-white">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{userId}</p>
                    </div>

                    {isAdmin ? (
                      // Admin only → Admin Panel
                      <Link
                        href="/admin"
                        className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                      >
                        <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        <span>Admin Panel</span>
                      </Link>
                    ) : (
                      <>
                        {/* User Panel */}
                        <Link
                          href="/user"
                          className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                        >
                          <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span>User Panel</span>
                        </Link>

                        {/* Sign Out */}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                          className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                        >
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span>Sign Out</span>
                        </button>

                        {/* Delete Account */}
                        <button
                          onClick={() => {
                            handleDeleteAccount();
                            setIsDropdownOpen(false);
                          }}
                          className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-white hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                        >
                          <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 text-white group-hover:text-red-300" />
                          <span className="font-medium">Delete Account</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden relative p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-gray-300 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/20 z-40 animate-in slide-in-from-top-2 duration-300"
            style={{
              backgroundImage: "url('/pattern.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "200px 200px",
            }}
          >
            <div className="absolute inset-0 bg-black/90" />
            <div className="relative max-w-7xl mx-auto px-4 py-6 space-y-2 z-10">
              {/* Main nav links */}
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}

              <div className="border-t border-white/20 pt-4 mt-4 space-y-2">
                {isAdmin ? (
                  // Admin only → Admin Panel
                  <Link
                    href="/admin"
                    className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Admin Panel</span>
                  </Link>
                ) : (
                  <>
                    {/* User Panel */}
                    <Link
                      href="/user"
                      className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">User Panel</span>
                    </Link>

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">Sign Out</span>
                    </button>

                    {/* Delete Account */}
                    <button
                      onClick={() => {
                        handleDeleteAccount();
                        setIsMobileMenuOpen(false);
                      }}
                      className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-white hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 text-white group-hover:text-red-300" />
                      <span className="font-medium">Delete Account</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="h-16" />
    </>
  );
};

export default Navbar;
