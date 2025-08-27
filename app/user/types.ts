// Types for User Panel

export interface User {
  id: string
  name: string
  email: string
  role: string
  resumeLink?: string
}

export interface Interview {
  id: string
  userId: string
  role: string
  level: string
  type: string
  finalized: boolean
  createdAt: Date
  questions?: {
    id?: string
    question: string
    answer?: string
    category?: string
  }[]
  reportUrl?: string
}

export interface Feedback {
  id: string
  interviewId: string
  userId: string
  totalScore: number
  strengths: string[]
  areasForImprovement: string[]
  categoryScores?: {
    category: string
    score: number
    maxScore: number
  }[]
  finalAssessment?: string
  createdAt: Date
}
