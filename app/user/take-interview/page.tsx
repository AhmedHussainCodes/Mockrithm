import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayCircle } from "lucide-react"
import Link from "next/link"


export default function TakeInterviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Take Interview</h1>
        <p className="text-gray-200">Start a new mock interview session</p>
      </div>

      <Card className="max-w-2xl border-gray-200">
        <CardHeader>
          <CardTitle className="text-white">Ready for your next interview?</CardTitle>
          <CardDescription className="text-gray-100">
            Click the button below to start a new mock interview. Make sure you have a quiet environment and a stable
            internet connection.
          </CardDescription>
        </CardHeader>
        <CardContent>
         <Link href="/interview">
  <Button size="lg" className="bg-black text-white hover:bg-gray-800">
    <PlayCircle className="mr-2 h-5 w-5" />
    Start Interview
  </Button>
</Link>

        </CardContent>
      </Card>
    </div>
  )
}
