import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import crypto from "crypto"
import { sendResetPasswordEmail } from "@/helpers/mailer";


connect()



export async function POST(request:NextRequest) {
    try {
        const {email}= await request.json()

        if(!email) {
            return NextResponse.json({error: "Email is required"}, {status: 400})
        }

        const user = await User.findOne({email})

        if(!user) {
            return NextResponse.json({message: "User doesn't exists"}, {status: 200})
        }

        const resetToken = crypto.randomBytes(32).toString("hex")
        user.resetToken = resetToken
        user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 mins
        
        await user.save()

        await sendResetPasswordEmail(email, resetToken)

        return NextResponse.json({message: "Password reset email sent"})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}