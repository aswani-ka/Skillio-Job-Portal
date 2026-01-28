import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { hashPassword } from "@/helpers/password";
import crypto from "crypto"
import { sendVerificationEmail } from "@/helpers/mailer";



connect()

export async function POST(request:NextRequest) {
    try {
        const { name, email, password, role }= await request.json()
        if(!name || !email || !password || !role) {
            return NextResponse.json(
                { error: "All fields are required!"},
                { status: 400 }
            )
        }

        const existingUser = await User.findOne({email})
        if(existingUser) {
            return NextResponse.json(
                { error: "User already exists"},
                { status: 400}
            )
        }

        const hashedPassword = await hashPassword(password)

        const verifyToken = crypto.randomBytes(32).toString("hex")

        
        await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            verifyToken,
            verifyTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiry
        })

        await sendVerificationEmail(email, verifyToken)

        return NextResponse.json({
            message: "Signup successful. Please verify your email."
        })
    } catch (error: any) {
        console.error("SIGNUP ERROR:", error)
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
