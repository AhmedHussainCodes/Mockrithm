"use server";

import { db } from "@/firebase/admin";
import { v4 as uuidv4 } from "uuid";

// save a new session
export async function trackSession(userId: string | null) {
  const now = new Date();

  await db.collection("sessions").add({
    sessionId: uuidv4(),
    userId: userId || "guest",
    startedAt: now,
  });
}
