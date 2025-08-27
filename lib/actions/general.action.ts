"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;
const userSnap = await db.collection("users").doc(userId).get();
const userData = userSnap.data();

const candidateName = userData?.name || "Candidate";
const email = userData?.email || "candidate@example.com";
  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

const { object } = await generateObject({
  model: google("gemini-2.0-flash-001", {
    structuredOutputs: false,
  }),
  schema: feedbackSchema, // Define schema with fixed categories + score + explanation
  prompt: `
You are an AI interviewer evaluating a candidate's mock interview performance.

Strict Rules:
- Always evaluate across the 5 categories: Communication Skills, Technical Knowledge, Problem-Solving, Cultural & Role Fit, Confidence & Clarity.
- Scores must be from 0 to 100.
- If candidate does not answer, says "I don’t know", or microphone is not connected (no audio detected), assign a score of 0 for the affected category and explicitly explain why (e.g., "No audio detected due to microphone issue").
- Do not invent or assume answers not present in the transcript.
- Be professional, direct, and constructive in feedback.

Evaluation Categories:
1. Communication Skills
2. Technical Knowledge
3. Problem-Solving
4. Cultural & Role Fit
5. Confidence & Clarity

Interview Transcript:
${formattedTranscript}

Your Task:
For each category:
- Provide a numeric score (0–100).
- Provide a short but clear justification for the score, including what went wrong and how the candidate can improve.
  `,
});

const feedback = {
  interviewId,
  userId,
  candidateName, 
  email,         
  totalScore: object.totalScore,
  categoryScores: object.categoryScores,
  strengths: object.strengths,
  areasForImprovement: object.areasForImprovement,
  finalAssessment: object.finalAssessment,
  createdAt: new Date().toISOString(),
};


    let feedbackRef;

    if (feedbackId) {
feedbackRef = db.collection("interviewsfeedback").doc();
    } else {
feedbackRef = db.collection("interviewsfeedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
  .collection("interviewsfeedback")
  .where("interviewId", "==", interviewId)
  .where("userId", "==", userId)
  .limit(1)
  .get();
  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}
