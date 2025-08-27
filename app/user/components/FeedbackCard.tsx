import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeedbackCardProps {
  category: string
  score: number
  maxScore: number
}

export function FeedbackCard({ category, score, maxScore }: FeedbackCardProps) {
  const percentage = (score / maxScore) * 100

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-black">{score}</span>
          <span className="text-sm text-gray-500">/ {maxScore}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-black h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
        </div>
      </CardContent>
    </Card>
  )
}
