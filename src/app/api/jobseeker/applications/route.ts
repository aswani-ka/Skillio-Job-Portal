import { NextRequest, NextResponse } from "next/server"
import { connect } from "@/dbConfig/dbConfig"
import { verifyToken } from "@/lib/jwt"
import Application from "@/models/Application"

export async function GET(request: NextRequest) {
  try {
    await connect()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json(
        {message: "Unauthorized"}, {status: 401})
    }

    const decoded: any = verifyToken(token)

    if (decoded.role !== "JOB_SEEKER") {
      return NextResponse.json({message: "Access denied"}, {status: 403})
    }

    const applications = await Application.find({
      applicant: decoded.id,
    })
      .populate("job", "position company")
      .sort({ createdAt: -1 })

    return NextResponse.json(applications)

  } catch (error) {
    console.error("Failed to fetch applications:", error)
    return NextResponse.json({message: "Failed to fetch applications"}, {status: 500})
  }
}
