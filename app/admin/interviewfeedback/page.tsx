"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/firebase/client"
import { useRouter } from "next/navigation"
import { getDoc, doc as docRef } from "firebase/firestore";

import {
  Search,
  Trash2,
  MoreHorizontal,
  Eye,
  Star,
  User,
  Calendar,
  Award,
  TrendingUp,
  AlertCircle,
  FileText,
  Filter,
} from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface Feedback {
  id: string
  candidateName: string
  email: string
  interviewer: string
  score: number | string
  createdAt: string
  finalAssessment: string
  areasForImprovement: string[]
  categoryScores: Array<{
    name: string
    score: number
    comment: string
  }>
}

export default function InterviewFeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const q = query(collection(db, "interviewsfeedback"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        const feedbackWithUserInfo = await Promise.all(
          snap.docs.map(async (doc) => {
            const data = doc.data();
            let userInfo = { name: "Unknown", email: "unknown@example.com" };

            if (data.userId) {
              try {
                const userSnap = await getDoc(docRef(db, "users", data.userId));
                const userData = userSnap.data();
                if (userData) {
                  userInfo = {
                    name: userData.name || "Unknown",
                    email: userData.email || "unknown@example.com",
                  };
                }
              } catch (err) {
                console.warn("Failed to fetch user info", err);
              }
            }

            return {
              id: doc.id,
              candidateName: data.candidateName || userInfo.name,
              email: data.email || userInfo.email,
              interviewer: data.interviewer || "MOCKRITHM",
              score: data.totalScore ?? "N/A",
              createdAt: data.createdAt?.toDate
                ? data.createdAt.toDate().toLocaleDateString()
                : data.createdAt || "N/A",
              finalAssessment: data.finalAssessment || "",
              areasForImprovement: data.areasForImprovement || [],
              categoryScores: data.categoryScores || [],
            };
          })
        );

        setFeedbacks(feedbackWithUserInfo);
      } catch (err) {
        console.error("Error fetching interview feedback:", err);
      }
    };

    fetchFeedbacks()

    // GSAP Animations
    gsap.fromTo(
      ".feedback-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".feedback-card",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    gsap.fromTo(
      ".table-row",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3,
      },
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const filteredFeedbacks = feedbacks
    .filter(
      (f) =>
        f.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.interviewer.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortBy === "highest") return Number(b.score) - Number(a.score)
      if (sortBy === "lowest") return Number(a.score) - Number(b.score)
      return 0
    })

  const handleDeleteFeedback = async (id: string) => {
    try {
      await deleteDoc(doc(db, "interviewsfeedback", id))
      setFeedbacks(feedbacks.filter((f) => f.id !== id))
    } catch (err) {
      console.error("Failed to delete feedback:", err)
    }
  }

  const getScoreColor = (score: number | string) => {
    const numScore = Number(score)
    if (numScore >= 80) return "text-green-400"
    if (numScore >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBadgeVariant = (score: number | string) => {
    const numScore = Number(score)
    if (numScore >= 80) return "bg-green-500/20 text-green-400 border-green-500/30"
    if (numScore >= 60) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    return "bg-red-500/20 text-red-400 border-red-500/30"
  }

  return (
    <div className="space-y-8 p-6 md:p-10 bg-black min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Interview Feedback</h1>
          <p className="text-white/70 mt-2">Manage and review submitted interview feedback</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-white/5 border-white/20 text-white">
            {feedbacks.length} Total Submissions
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Average Score</p>
                <p className="text-2xl font-bold text-white">
                  {feedbacks.length > 0
                    ? Math.round(feedbacks.reduce((acc, f) => acc + Number(f.score || 0), 0) / feedbacks.length)
                    : 0}
                </p>
              </div>
              <Award className="h-8 w-8 text-white/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">High Performers</p>
                <p className="text-2xl font-bold text-white">{feedbacks.filter((f) => Number(f.score) >= 80).length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-white/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">This Month</p>
                <p className="text-2xl font-bold text-white">
                  {
                    feedbacks.filter((f) => {
                      const feedbackDate = new Date(f.createdAt)
                      const currentMonth = new Date().getMonth()
                      return feedbackDate.getMonth() === currentMonth
                    }).length
                  }
                </p>
              </div>
              <Calendar className="h-8 w-8 text-white/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="feedback-card bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Feedback Submissions
          </CardTitle>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                placeholder="Search by candidate, email, or interviewer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 backdrop-blur-sm border-white/10 text-white placeholder:text-white/50 focus:border-white/30 focus:ring-white/20"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 bg-black/30 backdrop-blur-sm border-white/10 text-white focus:border-white/30">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/95 backdrop-blur-sm border-white/10">
                <SelectItem value="newest" className="text-white hover:bg-white/10">
                  Newest First
                </SelectItem>
                <SelectItem value="oldest" className="text-white hover:bg-white/10">
                  Oldest First
                </SelectItem>
                <SelectItem value="highest" className="text-white hover:bg-white/10">
                  Highest Score
                </SelectItem>
                <SelectItem value="lowest" className="text-white hover:bg-white/10">
                  Lowest Score
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredFeedbacks.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-white/70 font-medium">Name</TableHead>
                    <TableHead className="text-white/70 font-medium">Email</TableHead>                   
                    <TableHead className="text-white/70 font-medium">Interviewer</TableHead>
                    <TableHead className="text-white/70 font-medium">Score</TableHead>
                    <TableHead className="text-white/70 font-medium">Date</TableHead>
                    <TableHead className="text-white/70 font-medium">Status</TableHead>
                    <TableHead className="text-white/70 font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedbacks.map((feedback) => (
                    <TableRow
                      key={feedback.id}
                      className="table-row border-white/10 hover:bg-white/5 transition-colors"
                    >
                     <TableCell className="text-white">{feedback.candidateName}</TableCell>
<TableCell className="text-white/60">{feedback.email}</TableCell>
                      <TableCell className="text-white/80">{feedback.interviewer}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getScoreBadgeVariant(feedback.score)} font-medium`}>
                          {feedback.score}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/80">{feedback.createdAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${Number(feedback.score) >= 70
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            }`}
                        >
                          {Number(feedback.score) >= 70 ? "Passed" : "Review"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                                onClick={() => setSelectedFeedback(feedback)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black/95 backdrop-blur-sm border-white/10 max-w-4xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle className="text-white flex items-center gap-2">
                                  <User className="h-5 w-5" />
                                  Interview Feedback - {selectedFeedback?.candidateName}
                                </DialogTitle>
                              </DialogHeader>

                              <ScrollArea className="max-h-[60vh] pr-4">
                                <div className="space-y-6">
                                  {/* Candidate Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="bg-white/5 border-white/10">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <User className="h-4 w-4 text-white/70" />
                                          <span className="text-sm text-white/70">Candidate</span>
                                        </div>
                                        <p className="text-white font-medium">{selectedFeedback?.candidateName}</p>
                                        <p className="text-white/60 text-sm">{selectedFeedback?.email}</p>
                                      </CardContent>
                                    </Card>

                                    <Card className="bg-white/5 border-white/10">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Award className="h-4 w-4 text-white/70" />
                                          <span className="text-sm text-white/70">Overall Score</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`text-2xl font-bold ${getScoreColor(selectedFeedback?.score || 0)}`}
                                          >
                                            {selectedFeedback?.score}%
                                          </span>
                                          <Progress
                                            value={Number(selectedFeedback?.score || 0)}
                                            className="flex-1 h-2"
                                          />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Category Scores */}
                                  {selectedFeedback?.categoryScores && selectedFeedback.categoryScores.length > 0 && (
                                    <Card className="bg-white/5 border-white/10">
                                      <CardHeader>
                                        <CardTitle className="text-white text-lg flex items-center gap-2">
                                          <Star className="h-5 w-5" />
                                          Category Breakdown
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        {selectedFeedback.categoryScores.map((category, index) => (
                                          <div key={index} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                              <span className="text-white font-medium">{category.name}</span>
                                              <Badge variant="outline" className={getScoreBadgeVariant(category.score)}>
                                                {category.score}%
                                              </Badge>
                                            </div>
                                            <Progress value={category.score} className="h-2" />
                                            {category.comment && (
                                              <p className="text-white/70 text-sm">{category.comment}</p>
                                            )}
                                          </div>
                                        ))}
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Final Assessment */}
                                  {selectedFeedback?.finalAssessment && (
                                    <Card className="bg-white/5 border-white/10">
                                      <CardHeader>
                                        <CardTitle className="text-white text-lg flex items-center gap-2">
                                          <FileText className="h-5 w-5" />
                                          Final Assessment
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <p className="text-white/80 leading-relaxed">
                                          {selectedFeedback.finalAssessment}
                                        </p>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Areas for Improvement */}
                                  {selectedFeedback?.areasForImprovement &&
                                    selectedFeedback.areasForImprovement.length > 0 && (
                                      <Card className="bg-white/5 border-white/10">
                                        <CardHeader>
                                          <CardTitle className="text-white text-lg flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5" />
                                            Areas for Improvement
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <ul className="space-y-2">
                                            {selectedFeedback.areasForImprovement.map((area, index) => (
                                              <li key={index} className="flex items-start gap-2 text-white/80">
                                                <span className="text-white/50 mt-1">•</span>
                                                {area}
                                              </li>
                                            ))}
                                          </ul>
                                        </CardContent>
                                      </Card>
                                    )}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-sm border-white/10">
                              <DropdownMenuItem
                                className="text-red-400 hover:bg-white/5 focus:bg-white/5 cursor-pointer"
                                onClick={() => handleDeleteFeedback(feedback.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Feedback
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70 text-lg">No feedback found matching your criteria</p>
              <p className="text-white/50 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
