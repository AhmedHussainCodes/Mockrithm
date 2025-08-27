"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/firebase/client"
import type { User, Interview, Feedback } from "@/app/user/types"
import { getUserData, getUserInterviews, getUserFeedback } from "../lib/firestore"
import { DashboardCard } from "../components/DashboardCard"
import { DashboardSkeleton } from "../components/Skeletons"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DashboardPage() {
  const [user] = useAuthState(auth)
  const [userData, setUserData] = useState<User | null>(null)
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!user) return

      try {
        setLoading(true)
        const [userDataResult, interviewsResult, feedbackResult] = await Promise.all([
          getUserData(user.uid),
          getUserInterviews(user.uid),
          getUserFeedback(user.uid),
        ])

        setUserData(userDataResult)
        setInterviews(interviewsResult)
        setFeedback(feedbackResult)
      } catch (err) {
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return (
      <div className="space-y-6 bg-black p-8 min-h-screen">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back to your interview panel</p>
        </div>
        <DashboardSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-black">
        <Alert className="border-red-800 bg-red-900">
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const lastScore = feedback.length > 0 ? feedback[0].totalScore : 0
  const averageScore =
    feedback.length > 0 ? Math.round(feedback.reduce((sum, f) => sum + f.totalScore, 0) / feedback.length) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2 ">
          Welcome back, {userData?.name || "User"}!
        </h1>
        <p className="text-gray-400">Here's your interview progress overview</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <DashboardCard
          title="Total Interviews"
          value={interviews.length}
          description="Completed and in-progress interviews"
        />
        <DashboardCard
          title="Last Score"
          value={lastScore > 0 ? `${lastScore}%` : "N/A"}
          description="Your most recent interview score"
        />
        <DashboardCard
          title="Average Score"
          value={averageScore > 0 ? `${averageScore}%` : "N/A"}
          description="Average across all completed interviews"
        />
      </div>
    </div>
  )
}
