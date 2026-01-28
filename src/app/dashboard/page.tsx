"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardRedirect() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          withCredentials: true,
        })

        const role = res.data.user.role

        if (!isMounted) return

        if (role === "JOB_SEEKER") {
          router.replace("/dashboard/jobseeker")
        } else if (role === "RECRUITER") {
          router.replace("/dashboard/recruiter")
        } else {
          router.replace("/login")
        }
      } catch (error) {
        router.replace("/login")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchUser()

    return () => {
      isMounted = false
    }
  }, [router])

  if (!loading) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-league-spartan">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"/>

        <p className="text-gray-600 text-sm">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  )
}
