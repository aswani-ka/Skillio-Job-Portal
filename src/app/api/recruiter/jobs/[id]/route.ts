import { connect } from "@/dbConfig/dbConfig";
import Job from "@/models/Job";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";


export async function GET(
    request: NextRequest,
    {params}: {params: Promise<{id: string}>}
) {
    try {
        await connect()

        const {id} =  await params

        const token = request.cookies.get("token")?.value

        if(!token) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        const decoded: any = verifyToken(token)

        if(decoded.role !== "RECRUITER") {
            return NextResponse.json({message: "Access denied"}, {status: 403})
        }

        const job = await Job.findById(id)
        if(!job) {
            return NextResponse.json({message: "Job not found"}, {status: 404})
        }

        return NextResponse.json(job)

    } catch (error) {
        return NextResponse.json({message: "Job not found"}, {status: 500})
    }
}

export async function PUT(
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

        if(decoded.role !== "RECRUITER") {
            return NextResponse.json({message: "Only recruiters can update jobs"}, {status: 403})
        }

        const body = await request.json()

        const job = await Job.findById(jobId)

        if(!job) {
            return NextResponse.json({message: "Job not found"}, {status: 404})
        }

        if(job.postedBy.toString() !== decoded.id) {
            return NextResponse.json({message: "Not allowed to update this job"}, {status: 403})
        }

        const updateJob = await Job.findByIdAndUpdate(
            jobId,
            body,
            {new: true}
        )

        return NextResponse.json(updateJob, {status: 200})

    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Failed to update job"}, {status: 500})
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connect()

        const {id: jobId} = await params

        const token = request.cookies.get("token")?.value
        if(!token) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        const decoded: any = verifyToken(token)

        if(decoded.role != "RECRUITER") {
        return NextResponse.json({message: "Only recruiters can delete jobs"}, {status: 403})
        }

        const job = await Job.findById(jobId)

        if(!job) {
        return NextResponse.json({ message: "Job not found" }, { status: 404 })
        }

        if(job.postedBy.toString() !== decoded.id) {
        return NextResponse.json({message: "Not allowed to delete this job"}, {status: 403})
        }

        if(job.logo) {
        const publicId = job.logo
            .split("/")
            .slice(-1)[0]
            .split(".")[0]
        
            await cloudinary.uploader.destroy(`job-logos/${publicId}`)

        }

        await job.deleteOne()

        return NextResponse.json({message: "Job deleted successfully"}, {status: 200})

    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Failed to delete job"}, {status: 500})
    }
}