import { NextResponse } from "next/server";
import { auth, db } from "../../../firebase/admin";
const nodemailer = require("nodemailer");

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }

  try {
    const userRecord = await auth.getUserByEmail(email);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // expires in 10 minutes

    // ✅ Save to Firestore
    await db.collection("password_resets").doc(email).set({
      code,
      expiresAt,
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Mockrithm" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your verification code",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; line-height: 1.6;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f6f9; padding: 40px 0;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden; max-width: 600px; width: 100%;">
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Mockrithm</h1>
                            <p style="color: #e8e9ff; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Verification Code</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; text-align: center;">Your Verification Code</h2>
                            <p style="color: #4a5568; margin: 0 0 30px 0; font-size: 16px; text-align: center; line-height: 1.6;">We received a request to verify your email address. Use the code below to complete the verification process.</p>
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                                <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">Verification Code</p>
                                <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 0 auto; display: inline-block; min-width: 200px;">
                                    <span style="color: #2d3748; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace;">${code}</span>
                                </div>
                            </div>
                            <div style="background-color: #fff5f5; border-left: 4px solid #fed7d7; padding: 20px; margin: 30px 0; border-radius: 6px;">
                                <p style="color: #c53030; margin: 0; font-size: 14px; font-weight: 500;">⏰ This code expires in 10 minutes</p>
                                <p style="color: #742a2a; margin: 8px 0 0 0; font-size: 13px;">For security reasons, please do not share this code with anyone.</p>
                            </div>
                            <p style="color: #718096; margin: 30px 0 0 0; font-size: 14px; text-align: center; line-height: 1.5;">If you didn't request this code, please ignore this email or contact our support team.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="color: #a0aec0; margin: 0; font-size: 13px; line-height: 1.5;">This email was sent by <strong>Mockrithm</strong><br>If you have any questions, please contact our support team.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      return NextResponse.json(
        {
          success: false,
          message: "This email is not registered in our system.",
        },
        { status: 404 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
