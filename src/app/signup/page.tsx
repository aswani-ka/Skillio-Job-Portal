"use client"

import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserRole } from "@/constants/userRoles"

export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: UserRole.JOB_SEEKER,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [verifyLink, setVerifyLink] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { name, email, password, role } = formData

    if (!name || !email || !password) {
      toast.error("All fields are required")
      return
    }

    try {
      setLoading(true)

      const res = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
        role,
      })

      const link = res.data?.verifyLink as string | undefined

      if(link) {
        toast.success("Account created. Please verify your email using the demo link below.")
        setVerifyLink(link)
        return
      }

      toast.success("Signup successful. Please verify your email.")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 font-league-spartan px-4">
      <nav className="text-3xl font-bold tracking-wide text-white py-2">
        <Link href="/">
          <span className="text-teal-200">S</span>killio Job<span className="text-teal-200">Portal</span>
        </Link>
      </nav>

      <div className="min-h-[890px] flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 animate-fadeIn">
      
          {/* ===== BRAND ===== */}
          <h1 className="text-2xl font-extrabold text-center text-teal-500 mb-2">
            <span className="text-teal-700">S</span>killio Job<span className="text-teal-700">Portal</span>
          </h1>
          <p className="text-center text-gray-500 mb-6 text-lg">
            Create your account to get started
          </p>

          {/* ===== DEMO VERIFICATION BOX ===== */}
          {verifyLink && (
            <div className="mb-5 rounded-lg border border-teal-200 bg-teal-50 p-4">
              <p className="text-sm text-teal-900 font-semibold">
                Demo Mode:
              </p>
              <p className="text-sm text-teal-800 mt-1">
                Click below to verify your email and then login.
              </p>

              <div className="mt-3 flex gap-2">
                <a
                  href={verifyLink}
                  className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2 text-white font-semibold hover:bg-teal-800 transition"
                >
                  Verify Email (Demo)
                </a>

                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="inline-flex items-center justify-center rounded-lg border border-teal-300 px-4 py-2 text-teal-800 font-semibold hover:bg-white transition"
                >
                  Go to Login
                </button>
              </div>

              <p className="text-xs text-gray-600 mt-3">
                Note: In real production, verification happens via email inbox (Resend/SendGrid).
              </p>
            </div>
          )}

          {/* ===== FORM ===== */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-lg"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-lg"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 pr-12 text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            {/* ROLE */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-lg"
            >
              <option value={UserRole.JOB_SEEKER}>Job Seeker</option>
              <option value={UserRole.RECRUITER}>Recruiter</option>
            </select>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white text-xl py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          
          {/* FOOTER */}
          <p className="text-md text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
