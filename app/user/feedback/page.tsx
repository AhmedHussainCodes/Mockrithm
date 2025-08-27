"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/firebase/client"
import type { Feedback } from "@/app/user/types"
import { getUserFeedback } from "../lib/firestore"
import { FeedbackCard } from "../components/FeedbackCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export default function FeedbackPage() {
  const [user] = useAuthState(auth)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeedback() {
      if (!user) return

      try {
        setLoading(true)
        const result = await getUserFeedback(user.uid)
        setFeedback(result)
      } catch (err) {
        setError("Failed to load feedback")
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [user])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Feedback Overview</h1>
          <p className="text-gray-200">Your aggregated interview feedback and performance</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-gray-200">
              <CardHeader>
                <Skeleton className="h-4 w-24 bg-gray-200" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 bg-gray-200 mb-2" />
                <Skeleton className="h-2 w-full bg-gray-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-700">{error}</AlertDescription>
      </Alert>
    )
  }

  if (feedback.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Feedback Overview</h1>
          <p className="text-gray-200">Your aggregated interview feedback and performance</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-200 mb-4">No feedback available yet</p>
          <p className="text-sm text-gray-400">Complete your first interview to see feedback here</p>
        </div>
      </div>
    )
  }

  // Aggregate category scores across all feedback
  const aggregatedCategories = feedback.reduce(
    (acc, fb) => {
      fb.categoryScores.forEach((category) => {
        if (!acc[category.category]) {
          acc[category.category] = { totalScore: 0, totalMax: 0, count: 0 }
        }
        acc[category.category].totalScore += category.score
        acc[category.category].totalMax += category.maxScore
        acc[category.category].count += 1
      })
      return acc
    },
    {} as Record<string, { totalScore: number; totalMax: number; count: number }>,
  )

  // Aggregate strengths and areas for improvement
  const allStrengths = feedback.flatMap((fb) => fb.strengths)
  const allImprovements = feedback.flatMap((fb) => fb.areasForImprovement)

  // Get unique items with frequency
  const strengthCounts = allStrengths.reduce(
    (acc, strength) => {
      acc[strength] = (acc[strength] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const improvementCounts = allImprovements.reduce(
    (acc, improvement) => {
      acc[improvement] = (acc[improvement] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topStrengths = Object.entries(strengthCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([strength]) => strength)

  const topImprovements = Object.entries(improvementCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([improvement]) => improvement)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Feedback Overview</h1>
        <p className="text-gray-300">
          Aggregated feedback from {feedback.length} interview{feedback.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(aggregatedCategories).map(([category, data]) => (
          <FeedbackCard
            key={category}
            category={category}
            score={Math.round(data.totalScore / data.count)}
            maxScore={Math.round(data.totalMax / data.count)}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-white">Top Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topStrengths.map((strength, index) => (
                <li key={index} className="text-gray-200 flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  {strength}
                  {strengthCounts[strength] > 1 && (
                    <span className="ml-2 text-xs text-gray-500">({strengthCounts[strength]}x)</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-white">Areas to Focus On</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topImprovements.map((improvement, index) => (
                <li key={index} className="text-gray-200 flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  {improvement}
                  {improvementCounts[improvement] > 1 && (
                    <span className="ml-2 text-xs text-gray-500">({improvementCounts[improvement]}x)</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-white">Recent Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedback.slice(0, 3).map((fb, index) => (
              <div key={fb.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">Interview #{feedback.length - index}</span>
                  <span className="text-sm text-gray-200">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(fb.createdAt)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{fb.finalAssessment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
