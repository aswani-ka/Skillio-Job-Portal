import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";



export async function GET(request: NextRequest) {
    try {
        await connect()

        const token = request.cookies.get("token")?.value
        if(!token) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        const decoded: any = verifyToken(token)

        if(decoded.role !== "RECRUITER") {
            return NextResponse.json({message: "Forbidden"}, {status: 403})
        }

        const user = await User.findById(decoded.id).select(
            "companyName companyDescription companyWebsite companyLocation companyLogo "
        )

        return NextResponse.json(user)

    } catch (error) {
        return NextResponse.json({message: "Failed to load recruiter profile"}, {status: 500})
    }
}


export async function PUT(request: NextRequest) {
    try {
        await connect()

        const token = request.cookies.get("token")?.value   

        if(!token) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        const decoded: any = verifyToken(token)

        if(decoded.role !== "RECRUITER") {
            return NextResponse.json({message: "Forbidden"}, {status: 403})
        }   

        const body = await request.json()

        const updatedUser = await User.findByIdAndUpdate(
            decoded.id,
            {   
                companyName: body.companyName,
                companyDescription: body.companyDescription,
                companyWebsite: body.companyWebsite,
                companyLocation: body.companyLocation,
                companyLogo: body.companyLogo,
            },
            { new: true }
        )

        return NextResponse.json(updatedUser)


    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Failed to update recruiter profile"}, {status: 500})
    }
}