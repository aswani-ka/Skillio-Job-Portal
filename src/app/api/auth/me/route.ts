import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";



connect()


export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request)

    const user = await User.findById(userId).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

