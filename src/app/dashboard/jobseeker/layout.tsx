"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { FiMenu, FiX } from "react-icons/fi"

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true })
      router.push("/login")
    } catch {
      toast.error("Logout failed")
    }
  }

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link
        href="/dashboard/jobseeker"
        onClick={onClick}
        className="px-3 py-2 rounded-md hover:bg-teal-50 hover:text-teal-700 transition"
      >
        Dashboard
      </Link>

      <Link
        href="/jobs"
        onClick={onClick}
        className="px-3 py-2 rounded-md hover:bg-teal-50 hover:text-teal-700 transition"
      >
        Browse Jobs
      </Link>

      <Link
        href="/dashboard/jobseeker/applications"
        onClick={onClick}
        className="px-3 py-2 rounded-md hover:bg-teal-50 hover:text-teal-700 transition"
      >
        My Applications
      </Link>

      <Link
        href="/profile/jobseeker"
        onClick={onClick}
        className="px-3 py-2 rounded-md hover:bg-teal-50 hover:text-teal-700 transition"
      >
        My Profile
      </Link>

      <Link
        href="/profile/change-password"
        onClick={onClick}
        className="px-3 py-2 rounded-md hover:bg-teal-50 hover:text-teal-700 transition"
      >
        Change Password
      </Link>

      <button
        onClick={() => {
          onClick?.()
          handleLogout()
        }}
        className="px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
      >
        Logout
      </button>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-league-spartan">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
              <span className="text-teal-700 font-bold text-lg">J</span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Job Seeker Dashboard
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Manage your career journey
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2 text-base font-medium text-gray-700">
            <NavLinks />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg border hover:bg-gray-50 transition cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col text-gray-700">
              <NavLinks onClick={() => setMenuOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
