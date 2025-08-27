"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/firebase/client"
import type { User } from "@/app/user/types"
import { getUserData } from "../lib/firestore"
import { ProfileForm } from "../components/ProfileForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProfileSkeleton } from "../components/Skeletons"
import { UserIcon, Mail, ExternalLink } from "lucide-react"

export default function ProfilePage() {
  const [user] = useAuthState(auth)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return

      try {
        setLoading(true)
        const result = await getUserData(user.uid)
        setUserData(result)
      } catch (err) {
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleUserUpdate = (updatedUser: User) => {
    setUserData(updatedUser)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-200">Manage your account information</p>
        </div>
        <ProfileSkeleton />
      </div>
    )
  }

  if (error || !userData) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-700">{error || "Profile not found"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-200">Manage your account information</p>
        </div>
        <ProfileForm user={userData} onUpdate={handleUserUpdate} />
      </div>

      <Card className="max-w-2xl border-gray-200">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <UserIcon className="mr-2 h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-white">Name:</span>
            <span className="font-medium text-white">{userData.name}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-white">Email:</span>
            <span className="font-medium text-white flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              {userData.email}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-white">Role:</span>
<span className="font-medium text-white">{userData?.role || "User"}</span>
          </div>

          {userData.resumeLink && (
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Resume:</span>
              <a
                href={userData.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-black hover:text-gray-700 flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Resume
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
