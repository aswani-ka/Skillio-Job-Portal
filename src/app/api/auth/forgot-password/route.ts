import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json({
        message: "If the email exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    
    if (process.env.DEMO_MODE === "true") {
      return NextResponse.json({
        message: "Reset link generated (Demo Mode).",
        resetLink,
      });
    }

    await sendResetPasswordEmail(normalizedEmail, resetToken);

    return NextResponse.json({
      message: "If the email exists, a password reset link has been sent.",
    });
  } catch (error: any) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}