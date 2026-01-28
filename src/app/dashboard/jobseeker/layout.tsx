"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = async () => {
    await axios.post("/api/auth/logout")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100 font-league-spartan">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="md:max-w-7xl mx-auto md:px-6 md:py-4 flex justify-between items-center flex-wrap gap-6 p-2">
          <Link
            href="/dashboard/jobseeker"
          >
            <h1 className="text-3xl font-bold text-teal-600 md:mt-0 mt-3">
              Dashboard
            </h1>
          </Link>

          <div className="flex md:gap-6 items-center md:text-lg text-[16px] gap-2 font-medium mb-4 md:mb-0">
            <Link href="/jobs" className="hover:text-teal-600">
              Browse Jobs |
            </Link>

            <Link
              href="/dashboard/jobseeker/applications"
              className="hover:text-teal-600"
            >
              My Applications |
            </Link>

            <Link
              href="/profile/jobseeker"
              className="hover:text-teal-600"
            >
              My Profile |
            </Link>

            <Link 
              href="/profile/change-password"
              className="hover:text-teal-600"
            >
              <h2>Change Password |</h2>
            </Link>

            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="md:max-w-7xl mx-auto max-w-sm px-6 py-8">
        {children}
      </main>
    </div>
  )
}
