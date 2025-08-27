"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/firebase/client"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserPage() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/user/dashboard")
      } else {
        // Redirect to login page or show login form
        router.push("/login")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 bg-gray-200" />
          <Skeleton className="h-4 w-32 bg-gray-200" />
        </div>
      </div>
    )
  }

  return null
}
