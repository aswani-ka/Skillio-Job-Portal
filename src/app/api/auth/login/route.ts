import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import { comparePassword } from "@/helpers/password";
import { signToken } from "@/lib/jwt";
import { setAuthCookie } from "@/helpers/authCookie";



connect()


export async function POST(request:NextRequest) {
    try {
        const { email, password } = await request.json()
        const user = await User.findOne({email})
        if(!user) {
            return NextResponse.json(
                { error: "Invalid credentials"},
                { status: 401}
            )
        }

        const isPasswordValid = await comparePassword(password, user.password)
        
        if(!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials"},
                { status: 401}
            )
        }
        
        if(!user.isVerified) {
            return NextResponse.json(
                { error: "Please verify your email"},
                { status: 403}
            )
        }

        const token = signToken({
            id: user._id,
            role: user.role
        })

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        })

        setAuthCookie(response, token)
        return response
        
    } catch (error: any) {
        return NextResponse.json({ error: error.message}, { status: 500})
    }

}
