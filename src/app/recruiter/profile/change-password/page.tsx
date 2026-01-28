"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

export default function ChangePasswordPage() {
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      await axios.post("/api/auth/change-password", {
        oldPassword: currentPassword,
        newPassword,
      })

      toast.success("Password changed successfully")

      // Optional: force re-login
      router.push("/login")
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to change password"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-300/50 font-league-spartan">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* Header */}
        <h1 className="md:text-4xl text-3xl text-teal-600 font-bold text-center mb-2">
          Change your password
        </h1>

        <p className="md:text-md text-sm text-gray-800 text-center mb-6">
          Update your account password securely
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-lg font-medium text-gray-800">
              Current password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md outline-none
                           focus:ring-2 focus:ring-teal-500 text-lg"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showCurrent ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20}/>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-lg font-medium text-gray-800">
              New password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border rounded-md outline-none
                           focus:ring-2 focus:ring-teal-500 text-lg"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showNew ? (
                  <AiOutlineEyeInvisible size={20}/>
                ) : (
                  <AiOutlineEye size={20}/>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="text-lg font-medium text-gray-800">
              Confirm new password
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
                  <AiOutlineEyeInvisible size={20}/>
                ) : (
                  <AiOutlineEye size={20}/>
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
            {loading ? "Updating password..." : "Change Password"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          For security reasons, choose a strong password you haven't used before.
        </p>
      </div>
    </div>
  )
}
