import { connect } from "@/dbConfig/dbConfig"
import Job from "@/models/Job"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    await connect()

    const {id: jobId} = await params

    const job = await Job.findById(jobId)

    if (!job) {
      return NextResponse.json({message: "Job not found"}, {status: 404})
    }

    return NextResponse.json(job)

  } catch (error) {
    console.error(error)
    return NextResponse.json({message: "Failed to fetch job"}, {status: 500})
  }
}
