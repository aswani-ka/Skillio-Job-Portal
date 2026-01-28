import { connect } from "@/dbConfig/dbConfig";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { sendApplicationStatusEmail } from "@/helpers/mailer";



export async function GET(
    request: NextRequest,
    {params}: {params: Promise<{id: string}>}
) {
    try {
        await connect()

        const {id: jobId} = await params

        const token = request.cookies.get("token")?.value

        if(!token) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        const decoded: any = verifyToken(token)
        
        if (decoded.role !== "RECRUITER") {
            return NextResponse.json({message: "Access denied"}, {status: 401})
        }
        
        const job = await Job.findOne({
            _id: jobId,
            postedBy: decoded.id
        })

        if(!job) {
            return NextResponse.json({message: "Job not found"}, {status: 404})
        }

        const applications = await Application.find({job: jobId})
            .populate("applicant", "name email")
            .populate("job", "position company")
            .sort({createdAt: -1})
        
        return NextResponse.json(applications)

    } catch (error) {
        return NextResponse.json({message: "Failed to fetch applicants"}, {status: 500})
    }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect()

    const { id: jobId } = await params

    const token = request.cookies.get("token")?.value
    
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded: any = verifyToken(token)
    
    if (decoded.role !== "RECRUITER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { applicationId, status } = await request.json()

    if (!["SHORTLISTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 })
    }

    // Verify recruiter owns the job
    const job = await Job.findOne({
      _id: jobId,
      postedBy: decoded.id
    })

    if (!job) {
      return NextResponse.json({ message: "Not allowed" }, { status: 403 })
    }

    // Update application
    const application = await Application.findOneAndUpdate(
      { _id: applicationId, job: jobId },
      { status },
      { new: true }
    )
    .populate("applicant", "name email")
    .populate("job", "position company")

    if (!application) {
      return NextResponse.json({message: "Application not found"}, {status: 404})
    }

    await sendApplicationStatusEmail({
      email: application.applicant.email,
      name: application.applicant.name,
      jobTitle: application.job.position,
      company: application.job.company,
      status 
    })

    return NextResponse.json(application)

  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Update failed" }, { status: 500 })
  }
}

