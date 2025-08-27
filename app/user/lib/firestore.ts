// Firestore helpers for User Panel
import { collection, doc, getDocs, getDoc, query, where, orderBy, updateDoc } from "firebase/firestore"
import { db } from "@/firebase/client"
import type { User, Interview, Feedback } from "@/app/user/types"

export async function getUserData(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User
    }
    return null
  } catch (error) {
    console.error("Error fetching user data:", error)
    throw error
  }
}

export async function getUserInterviews(userId: string): Promise<Interview[]> {
  try {
    const q = query(
      collection(db, "interviews"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      const rawCreatedAt = data.createdAt
      const createdAt = rawCreatedAt?.toDate ? rawCreatedAt.toDate() : new Date(rawCreatedAt)

      return {
        id: doc.id,
        ...data,
        createdAt,
      } as Interview
    })
  } catch (error) {
    console.error("Error fetching user interviews:", error)
    throw error
  }
}

export async function getInterviewById(interviewId: string): Promise<Interview | null> {
  try {
    const interviewDoc = await getDoc(doc(db, "interviews", interviewId))
    if (interviewDoc.exists()) {
      const data = interviewDoc.data()
      const rawCreatedAt = data.createdAt
      const createdAt = rawCreatedAt?.toDate ? rawCreatedAt.toDate() : new Date(rawCreatedAt)

      return {
  id: interviewDoc.id,
  ...data,
  createdAt,
  questions: data.questions?.map((q: string, index: number) => ({ id: `q${index}`, question: q })) || [],
} as Interview

    }
    return null
  } catch (error) {
    console.error("Error fetching interview:", error)
    throw error
  }
}

export async function getUserFeedback(userId: string): Promise<Feedback[]> {
  try {
    const q = query(
      collection(db, "interviewsfeedback"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      const rawCreatedAt = data.createdAt
      const createdAt = rawCreatedAt?.toDate ? rawCreatedAt.toDate() : new Date(rawCreatedAt)

      return {
        id: doc.id,
        ...data,
        createdAt,
      } as Feedback
    })
  } catch (error) {
    console.error("Error fetching user feedback:", error)
    throw error
  }
}

export async function getInterviewFeedback(interviewId: string): Promise<Feedback | null> {
  const q = query(collection(db, "interviewsfeedback"), where("interviewId", "==", interviewId))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty) return null

  const docSnap = querySnapshot.docs[0]
  const data = docSnap.data()

  return {
    id: docSnap.id,
    ...data,
    createdAt: new Date(data.createdAt),
    strengths: data.strengths || [],
    areasForImprovement: data.areasForImprovement || [],
    categoryScores: data.categoryScores?.map((c: any) => ({
      category: c.name,     
      score: c.score,
      maxScore: 5,           
    })) || [],
  } as Feedback
}


export async function updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
  try {
    await updateDoc(doc(db, "users", userId), data)
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}
