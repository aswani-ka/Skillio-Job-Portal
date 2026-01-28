"use client"

import axios from "axios"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

type Status = "loading" | "success" | "error"

export default function VerifyEmailPage() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token")

  const [status, setStatus] = useState<Status>("loading")
  const [message, setMessage] = useState("Verifying your email...")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid or missing verification link")
      return
    }

    const verifyEmail = async () => {
      try {
        await axios.post("/api/auth/verify-email", { token })
        setStatus("success")
        setMessage("Your email has been verified successfully")
      } catch (error) {
        setStatus("error")
        setMessage("Verification failed or link has expired")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-league-spartan">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">

        {/* Status Icon */}
        {status === "loading" && (
          <div className="mb-4 text-blue-600 text-4xl">⏳</div>
        )}
        {status === "success" && (
          <div className="mb-4 text-green-600 text-4xl">✅</div>
        )}
        {status === "error" && (
          <div className="mb-4 text-red-600 text-4xl">❌</div>
        )}

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-2">
          {status === "loading" && "Verifying Email"}
          {status === "success" && "Email Verified"}
          {status === "error" && "Verification Failed"}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* Actions */}
        {status === "success" && (
          <Link
            href="/login"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Continue to Login
          </Link>
        )}

        {status === "error" && (
          <Link
            href="/login"
            className="inline-block text-blue-600 underline text-sm"
          >
            Go back to Login
          </Link>
        )}

      </div>
    </div>
  )
}
