import { verifyToken } from "@/lib/jwt";
import Job from "@/models/Job";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";


export async function POST(request:NextRequest) {
    try {
        await connect()

        const token =  request.cookies.get("token")?.value

        if(!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 }) 
        }

        const decoded: any = verifyToken(token)

        if(decoded.role !== "RECRUITER") {
            return NextResponse.json({ message: "Only recuiters can post jobs" }, { status: 403 })
        }

        const formData = await request.formData()
        const logoFile = formData.get("logo") as File
        if(!logoFile) {
            return NextResponse.json({message: "Logo required"}, {status: 400})
        }

        const buffer = Buffer.from(await logoFile.arrayBuffer())

        const upload: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {folder: "job-logos"},
                (error, result) => {
                    if(error) reject(error)
                    else resolve(result)
                }
            ).end(buffer)
        })
        
        const job = await Job.create({
            company: formData.get("company"),
            logo: upload.secure_url,
            position: formData.get("position"),
            role: formData.get("role"),
            level: formData.get("level"),
            contract: formData.get("contract"),
            location: formData.get("location"),
            description: formData.get("description"),
            languages: formData.get("languages")?.toString().split(","),
            tools: formData.get("tools")?.toString().split(","),
            isNew: true,
            featured: formData.get("featured") === "true",
            postedBy: decoded.id
        })

        return NextResponse.json(job, { status: 201 })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to create job" },
            { status: 500 }
        )
    }
}


export async function GET(request: NextRequest) {
  try {
    await connect()

    const token = request.cookies.get("token")?.value
        if (!token) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        const decoded: any = verifyToken(token)

        if (decoded.role !== "RECRUITER") {
            return NextResponse.json({message: "Access denied"}, {status: 403})
        }

        const jobs = await Job.find({ postedBy: decoded.id }).sort({ createdAt: -1 })

        return NextResponse.json(jobs)
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: "Failed to fetch jobs"}, {status: 500})
    }
}

