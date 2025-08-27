import { db } from "@/firebase/client"
import { addDoc, collection, Timestamp } from "firebase/firestore"

export const submitFeedback = async ({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}) => {
  try {
    const feedbackRef = collection(db, "feedback")
    await addDoc(feedbackRef, {
      name,
      email,
      message,
      createdAt: Timestamp.now(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return { success: false, error }
  }
}
