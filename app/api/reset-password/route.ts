// /app/api/reset-password/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/firebase/admin"; // Firebase Admin SDK

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await auth.getUserByEmail(email);

    await auth.updateUser(user.uid, {
      password,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return NextResponse.json({ success: false, message: "Failed to reset password" }, { status: 500 });
  }
}
