import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/User"
import { verifyToken } from "@/lib/jwt"
import cloudinary from "@/lib/cloudinary"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request:NextRequest) {
    try {
        await connect()
        const token = request.cookies.get("token")?.value
        if(!token) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        const decoded: any = verifyToken(token)
        if(decoded.role !== "JOB_SEEKER") {
            return NextResponse.json({message: "Access denied"}, {status: 403})
        }

        const user = await User.findById(decoded.id).select("-password")
        return NextResponse.json(user)

    } catch (error) {
        return NextResponse.json({message: "Failed to load profile"}, {status: 500})
    }
}


export async function PUT(request:NextRequest) {
    try {
        await connect()

        const token = request.cookies.get("token")?.value
        if(!token) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        const decoded: any = verifyToken(token)

        if(decoded.role !== "JOB_SEEKER") {
            return NextResponse.json({message: "Access denied"}, {status: 403})
        }

        const formData = await request.formData()

         /* ✅ PARSE SKILLS PROPERLY */
        const skillsRaw = formData.get("skills")
        const skills =
        typeof skillsRaw === "string" ? JSON.parse(skillsRaw) : []

        let resumeUrl = formData.get("resumeUrl")?.toString()

        const resume = formData.get("resume") as File | null

        if(resume) {
            const buffer = Buffer.from(await resume.arrayBuffer())

            const upload: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "resumes",
                        resource_type: "raw",
                        format: "pdf"
                    },
                    (err, result) => {
                        if(err) reject(err)
                        else resolve(result)
                    }
                ).end(buffer)
            })
            resumeUrl = upload.secure_url
        }

        const updatedUser = await User.findByIdAndUpdate(
            decoded.id,
            {
                bio: formData.get("bio"),
                skills,
                experience: formData.get("experience"),
                resumeUrl,
                linkedIn: formData.get("linkedin"),
                github: formData.get("github")
            },
            {new: true}
        )

        return NextResponse.json(updatedUser)

    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Profile update failed"}, {status: 500})
    }
}
