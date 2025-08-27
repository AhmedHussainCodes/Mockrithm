"use server";

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";


const SESSION_DURATION = 60 * 60 * 24 * 7;

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000,
  });
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;
  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return { success: false, message: "User already exists. Please sign in." };

    await db.collection("users").doc(uid).set({ name, email });

    return { success: true, message: "Account created successfully. Please sign in." };
  } catch (error: any) {
    if (error.code === "auth/email-already-exists") {
      return { success: false, message: "This email is already in use" };
    }
    return { success: false, message: "Failed to create account. Please try again." };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;
  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return { success: false, message: "User does not exist. Create an account." };

    await setSessionCookie(idToken);

    await db.collection("sessions").add({
      userId: userRecord.uid,
      email,
      createdAt: new Date(),
    });

    return { success: true };
  } catch {
    return { success: false, message: "Failed to log into account. Please try again." };
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db.collection("users").doc(decodedClaims.uid).get();
    if (!userRecord.exists) return null;

    return { ...userRecord.data(), id: userRecord.id } as User;
  } catch {
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
