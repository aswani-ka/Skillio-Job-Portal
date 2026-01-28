import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"


export const verifyToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value
        if(!token) {
            throw new Error("Unauthorized")
        }
        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET!
        )
        return decoded.id
    } catch (error) {
        throw new Error("Unauthorized")
    }
}