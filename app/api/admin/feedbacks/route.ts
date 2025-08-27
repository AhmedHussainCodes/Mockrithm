import { db } from "@/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "feedbacks"));
    const feedbacks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(feedbacks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
  }
}
