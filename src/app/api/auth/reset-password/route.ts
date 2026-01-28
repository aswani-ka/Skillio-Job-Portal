import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { hashPassword } from "@/helpers/password";


connect()

export async function POST(request:NextRequest) {
    try {
        const {token, newPassword} = await request.json()

        if(!token || !newPassword) {
            return NextResponse.json({error: "Token and Paswword is required"})
        }

        const user = await User.findOne({
            resetToken : token,
            resetTokenExpiry : { $gt: Date.now()}
        })

        if(!user) {
            return NextResponse.json({error: "Invalid or expired token"}, {status: 400})
        }

        user.password = await hashPassword(newPassword)
        user.resetToken = undefined
        user.resetTokenExpiry = undefined
        await user.save()

        return NextResponse.json({message: "Password reset successful"})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}