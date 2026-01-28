import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/proxy/auth";
import { NextRequest, NextResponse } from "next/server";


connect()


export async function POST(request:NextRequest) {
    try {
        const userId = verifyToken(request)
        const body = await request.json()

        const { oldPassword, newPassword } = body

        if(!oldPassword || !newPassword) {
            return NextResponse.json({error: "All fields are required! "}, {status: 400})
        }
        
        const user = await User.findById(userId)
        if(!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const isPasswordValid = await bcrypt.compare(
            oldPassword,
            user.password
        )
        
        if(!isPasswordValid) {
            return NextResponse.json({error: "Old password is incorrect"}, {status: 400});
        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        await user.save()

        return NextResponse.json({
            message: "Password changed successfully",
            success: true,
        });

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}