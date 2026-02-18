"use client"

import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { FiMenu, FiX } from "react-icons/fi"

interface Job {
  _id: string
  position: string
  location: string
  contract: string
}

export default function RecruiterDashboard() {
  const router = useRouter()

  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/recruiter/jobs", {
          withCredentials: true,
        })
        setJobs(res.data)
      } catch (error) {
        toast.error("Failed to load jobs")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const stats = useMemo(() => {
    return {
      totalJobs: jobs.length,
    }
  }, [jobs])

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return

    try {
      await axios.delete(`/api/recruiter/jobs/${jobId}`, {
        withCredentials: true,
      })
      toast.success("Job deleted")
      setJobs(prev => prev.filter(job => job._id !== jobId))
    } catch {
      toast.error("Failed to delete job")
    }
  }

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
        href="/dashboard/recruiter"
        onClick={onClick}
        className="px-3 py-2 rounded-md hover:bg-teal-50 hover:text-teal-700 transition"
      >
        Jobs
      </Link>
      <Link
        href="/recruiter/profile"
        onClick={onClick}
        className="px-3 py-2 rounded-md hover:bg-teal-50 hover:text-teal-700 transition"
      >
        Company Profile
      </Link>
      <Link
        href="/recruiter/profile/change-password"
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
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
              <span className="text-teal-700 font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Recruiter Dashboard
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                Manage jobs and applicants
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

        {/* Mobile Nav Panel */}
        {menuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col text-gray-700">
              <NavLinks onClick={() => setMenuOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Job Posts
            </h2>
            <p className="text-gray-600 mt-2 text-base">
              Create, edit and manage your job listings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="bg-white border rounded-xl px-4 py-3 flex items-center justify-between sm:justify-start gap-3">
              <span className="text-sm text-gray-500">Total Jobs</span>
              <span className="text-lg font-bold text-gray-900">
                {stats.totalJobs}
              </span>
            </div>

            <Link
              href="/dashboard/recruiter/create"
              className="inline-flex justify-center items-center bg-teal-600 text-white px-5 py-3 rounded-xl hover:bg-teal-700 transition font-semibold"
            >
              + Post Job
            </Link>
          </div>
        </div>

        {/* Job list */}
        {loading ? (
          <div className="bg-white border rounded-xl p-6 text-gray-500">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white border rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No job posts yet
            </h3>
            <p className="text-gray-600 mb-5">
              Post your first job and start receiving applications.
            </p>
            <Link
              href="/dashboard/recruiter/create"
              className="inline-flex items-center justify-center bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition font-semibold"
            >
              Post your first job
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white border rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="p-4 font-semibold">Position</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map(job => (
                    <tr
                      key={job._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-semibold text-gray-900">
                        {job.position}
                      </td>
                      <td className="p-4 text-gray-600">{job.location}</td>
                      <td className="p-4 text-gray-600">{job.contract}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-4">
                          <Link
                            href={`/dashboard/recruiter/edit/${job._id}`}
                            className="text-teal-700 hover:underline font-medium"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/dashboard/recruiter/jobs/${job._id}/applicants`}
                            className="text-blue-700 hover:underline font-medium"
                          >
                            Applicants
                          </Link>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="text-red-600 hover:underline font-medium cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid gap-4">
              {jobs.map(job => (
                <div
                  key={job._id}
                  className="bg-white border rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {job.position}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {job.location} • {job.contract}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/dashboard/recruiter/edit/${job._id}`}
                      className="px-4 py-2 rounded-lg border text-teal-700 font-semibold hover:bg-teal-50 transition"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/dashboard/recruiter/jobs/${job._id}/applicants`}
                      className="px-4 py-2 rounded-lg border text-blue-700 font-semibold hover:bg-blue-50 transition"
                    >
                      Applicants
                    </Link>

                    <button
                      onClick={() => handleDelete(job._id)}
                      className="px-4 py-2 rounded-lg border text-red-600 font-semibold hover:bg-red-50 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
