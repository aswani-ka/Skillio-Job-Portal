"use client"

import axios from "axios"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired reset link")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.error("All fields are required")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      await axios.post("/api/auth/reset-password", {
        token,
        newPassword: password,
      })

      toast.success("Password updated successfully")
      router.push("/login")
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to reset password"
      )
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-league-spartan">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-red-600">
            Invalid Reset Link
          </h2>
          <p className="text-md text-gray-700 mt-3">
            The password reset link is invalid or has expired.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-teal-500 to-teal-700 px-4 font-league-spartan">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl text-teal-600 font-bold text-center mb-2">
          Reset your password
        </h1>

        <p className="text-md text-gray-800 text-center mb-6">
          Create a new password for your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-lg font-medium text-gray-800">
              New password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md outline-none
                           focus:ring-2 focus:ring-teal-500 text-lg"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showNew ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-lg font-medium text-gray-800">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md outline-none
                           focus:ring-2 focus:ring-teal-500 text-lg"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showConfirm ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-lg text-white py-2 rounded-md
                       hover:bg-teal-700 transition
                       disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Updating password..." : "Reset Password"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          For security reasons, choose a strong password you haven't used before.
        </p>
      </div>
    </div>
  )
}
