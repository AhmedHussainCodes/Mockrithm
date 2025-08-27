import type React from "react"
import { Sidebar } from "./components/Sidebar"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen border-t border-gray-700">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
