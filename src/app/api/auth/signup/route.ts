import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { hashPassword } from "@/helpers/password";
import crypto from "crypto";
import { sendVerificationEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      verifyToken,
      verifyTokenExpiry,
      isVerified: false, 
    });

    
    const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}`;


    if (process.env.DEMO_MODE !== "true") {
      await sendVerificationEmail(email, verifyToken);
    }

    return NextResponse.json({
      message:
        process.env.DEMO_MODE === "true"
          ? "Signup successful. Use the demo link to verify your email."
          : "Signup successful. Please verify your email.",
      ...(process.env.DEMO_MODE === "true" ? { verifyLink } : {}),
    });
  } catch (error: any) {
    console.error("SIGNUP ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}