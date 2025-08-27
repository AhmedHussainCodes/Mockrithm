"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { Interview, Feedback } from "@/app/user/types"
import { getInterviewById, getInterviewFeedback } from "../../lib/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Briefcase } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function InterviewDetailPage() {
  const params = useParams()
  const interviewId = params.id as string

  const [interview, setInterview] = useState<Interview | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [interviewResult, feedbackResult] = await Promise.all([
          getInterviewById(interviewId),
          getInterviewFeedback(interviewId),
        ])

        setInterview(interviewResult)
        setFeedback(feedbackResult)
      } catch (err) {
        setError("Failed to load interview details")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [interviewId])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-gray-700" />
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-gray-700 bg-gray-800">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !interview) {
    return (
      <Alert className="border-red-800 bg-red-900">
        <AlertDescription className="text-red-200">{error || "Interview not found"}</AlertDescription>
      </Alert>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Interview Details</h1>
          <p className="text-gray-200">Review your interview performance and feedback</p>
        </div>
        {interview.reportUrl && (
          <Button
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700 bg-transparent"
            onClick={() => window.open(interview.reportUrl, "_blank")}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Interview Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-200">Role:</span>
              <span className="font-medium text-white">{interview.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-200">Level:</span>
              <span className="font-medium text-white">{interview.level}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-200">Type:</span>
              <span className="font-medium text-white">{interview.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-200">Status:</span>
              <Badge
                variant={interview.finalized ? "default" : "secondary"}
                className={interview.finalized ? "bg-gray-700 text-white" : "bg-gray-600 text-gray-200"}
              >
                {interview.finalized ? "Completed" : "In Progress"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Date:</span>
              <span className="font-medium text-white">{formatDate(interview.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        {feedback && (
          <Card className="border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{feedback.totalScore}%</div>
                <p className="text-gray-400">Total Score</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {interview.questions && interview.questions.length > 0 && (
        <Card className="border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Questions & Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {interview.questions.map((question, index) => (
              <div key={question.id || index} className="border-b border-gray-700 pb-4 last:border-b-0">
                <h3 className="font-medium text-white mb-2">
                  Q{index + 1}: {question.question}
                </h3>
                {question.answer && <p className="text-gray-300 bg-gray-900 p-3 rounded-md">{question.answer}</p>}
                {question.category && (
                  <Badge variant="secondary" className="mt-2 bg-gray-600 text-gray-200">
                    {question.category}
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {feedback && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="text-gray-300 flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feedback.areasForImprovement.map((area, index) => (
                  <li key={index} className="text-gray-300 flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    {area}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {feedback?.categoryScores && feedback.categoryScores.length > 0 && (
        <Card className="border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Category Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {feedback.categoryScores.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">{category.category}</span>
                    <span className="text-sm text-gray-400">
                      {category.score}/{category.maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(category.score / category.maxScore) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {feedback?.finalAssessment && (
        <Card className="border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Final Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">{feedback.finalAssessment}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}