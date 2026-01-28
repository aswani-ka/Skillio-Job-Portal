import { verifyToken } from "@/lib/jwt";
import { NextRequest } from "next/server";


export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value
        
        if(!token) {
            throw new Error("Token not found")
        }
        const decodedToken: any = verifyToken(token)

        return decodedToken.id
    } catch (error) {
        throw new Error("Invalid or expired token")
    }
}