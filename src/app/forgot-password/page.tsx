"use client"

import axios from "axios"
import toast from "react-hot-toast"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Email is required")
      return
    }

    try {
      setLoading(true)
      await axios.post("/api/auth/forgot-password", { email })
      toast.success("Password reset link sent to your email")
      setEmail("")
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 to-emerald-700 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 animate-fadeIn font-league-spartan">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl text-center font-bold text-teal-600">
            Forgot your password?
          </h1>
          <p className="text-md text-gray-500 mt-4">
            Enter your registered email and we'll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-lg border rounded-md outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-lg text-white py-2.5 rounded-md font-medium hover:bg-teal-700 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-md text-gray-600">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-teal-600 hover:underline font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  )
}
