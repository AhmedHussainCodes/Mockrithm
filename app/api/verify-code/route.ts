import { NextResponse } from "next/server";
import { db } from "@/firebase/admin"; // Make sure this path is correct

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Missing email or code." },
        { status: 400 }
      );
    }

    const docRef = db.collection("password_resets").doc(email);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return NextResponse.json(
        { success: false, message: "Reset request not found." },
        { status: 404 }
      );
    }

    const data = snapshot.data();

    if (data.code !== code) {
      return NextResponse.json(
        { success: false, message: "Invalid code." },
        { status: 401 }
      );
    }

    if (Date.now() > data.expiresAt) {
      return NextResponse.json(
        { success: false, message: "Code has expired." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("VERIFY CODE ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
