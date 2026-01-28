"use client"

import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Email and password are required")
      return
    }

    try {
      setLoading(true)

      await axios.post("/api/auth/login", {
        email,
        password,
      })

      toast.success("Login successful")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 px-4 font-league-spartan">
      <Link href="/">
        <nav className="text-3xl tracking-wide text-white font-bold py-2">
          <span className="text-teal-200">S</span>killio Job<span className="text-teal-200">Portal</span>
        </nav>
      </Link>
      <div className="min-h-[890px] flex items-center justify-center ">
      
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 animate-fadeIn">
      
          {/* ===== BRAND ===== */}
          <h1 className="text-2xl font-extrabold text-center text-teal-500 mb-2">
            <span className="text-teal-700">S</span>killio Job<span className="text-teal-700">Portal</span>
          </h1>
          <p className="text-center text-gray-500 mb-6 text-lg">
            Login to continue your journey
          </p>
          {/* ===== FORM ===== */}
          <form onSubmit={handleSubmit} className="space-y-4">
      
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-lg"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-60 cursor-pointer text-xl"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          {/* ===== LINKS ===== */}
          <div className="flex justify-between text-md mt-6 text-gray-600">
            <Link href="/forgot-password" className="hover:text-teal-600 hover:underline">
              Forgot password?
            </Link>
            <Link href="/signup" className="hover:text-teal-600 hover:underline font-medium">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
