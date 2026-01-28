import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/User";


connect()


export async function POST(request:NextRequest) {
    try {
        const { token } = await request.json()
        if(!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            )
        }

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now()}
        })

        if(!user) {
            return NextResponse.json(
                {error: "Invalid or expired token"},
                {status: 400}
            )
        }

        user.isVerified = true,
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save()

        return NextResponse.json({
            message: "Email verified successfully"
        })

    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}