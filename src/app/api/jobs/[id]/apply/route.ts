import { verifyToken } from "@/lib/jwt"
import { connect } from "@/dbConfig/dbConfig"
import Application from "@/models/Application"
import Job from "@/models/Job"
import User from "@/models/User"
import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect()

    const {id: jobId} = await params

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({message: "Unauthorized"}, {status: 401})
    }

    const decoded: any = verifyToken(token)

    if (decoded.role !== "JOB_SEEKER") {
      return NextResponse.json({message: "Only job seekers can apply"}, {status: 403})
    }

    const job = await Job.findById(jobId)
    if (!job) {
      return NextResponse.json({message: "Job not found"}, {status: 404})
    }

    const existing = await Application.findOne({
      job: jobId,
      applicant: decoded.id
    })

    if (existing) {
      return NextResponse.json({message: "Already applied to this job"}, {status: 400})
    }

    const formData = await request.formData()
    const resumeFile = formData.get("resume") as File | null
    const coverLetter = formData.get("coverLetter")?.toString() || ""

    let resumeUrl: string | null = null

    // If user uploaded resume during apply → upload to Cloudinary
    if (resumeFile) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer())

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            resource_type: "raw"
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      })

      resumeUrl = uploadResult.secure_url
    }

    // Else → use resume from profile
    if (!resumeUrl) {
      const user = await User.findById(decoded.id)

      if (!user?.resumeUrl) {
        return NextResponse.json({message: "Please upload resume in profile or while applying"}, {status: 400})
      }
      resumeUrl = user.resumeUrl
    }

    const application = await Application.create({
      job: jobId,
      applicant: decoded.id,
      resumeUrl,
      coverLetter,
      status: "PENDING"
    })

    return NextResponse.json(application, {status: 201})
  } catch (error) {
    console.error(error)
    return NextResponse.json({message: "Failed to apply for job"}, {status: 500})
  }
}
