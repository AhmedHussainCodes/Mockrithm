"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, PlayCircle, FileText, MessageSquare, User } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
  { name: "Take Interview", href: "/user/take-interview", icon: PlayCircle },
  { name: "Your Interviews", href: "/user/interviews", icon: FileText },
  { name: "Feedback", href: "/user/feedback", icon: MessageSquare },
  { name: "Profile", href: "/user/profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-t border-r border-gray-700">
      <div className="flex h-16 items-center px-6 border-b border-gray-700">
        <h1 className="text-xl font-semibold text-white">Interview Panel</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300",
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}