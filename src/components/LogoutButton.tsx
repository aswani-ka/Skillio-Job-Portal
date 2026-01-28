"use client"

import axios from "axios"
import { useRouter } from "next/navigation"


export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout")
            router.push("/login")
            router.refresh()
        } catch (error) {
            console.error("Logout failed");
        }
    }
    return (
        <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
        >
            Logout
        </button>
    )
}