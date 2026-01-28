import Job from "@/models/Job";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {
        await connect()
        
        const { searchParams } = new URL(request.url)

        const page = Number(searchParams.get("page")) || 1
        const limit = Number(searchParams.get("limit")) || 10
        const keyword = searchParams.get("keyword") || ""
        const tags = searchParams.getAll("tags")

        const skip = (page - 1) * limit

        const query: any = {}

        if(keyword) {
            query.$or = [
                {position: {$regex: keyword, $options: "i"}},
                {company: {$regex: keyword, $options: "i"}}
            ]
        }

        if(tags.length > 0) {
            query.$and = tags.map(tag => ({
                $or: [
                    { role: tag },
                    { level: tag },
                    { languages: tag },
                    { tools: tag }
                ]
            }))
        }
       
        const totalJobs = await Job.countDocuments(query)

        const jobs = await Job.find(query)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
        
        return NextResponse.json({
            jobs,
            pagination: {
                totalJobs,
                currentPage: page,
                totalPages: Math.ceil(totalJobs / limit)
            }
        })

    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Failed to fetch jobs"}, {status: 500})
    }
}
