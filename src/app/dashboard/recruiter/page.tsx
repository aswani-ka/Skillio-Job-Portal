"use client"

import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

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
    await axios.post("/api/auth/logout")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100 font-league-spartan">
      {/* NAVBAR */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between flex-col lg:flex-row gap-3">
          <h1 className="text-3xl font-bold text-teal-600">
             Dashboard
          </h1>

          <nav className="flex gap-5 text-lg font-medium mb-2">
            <Link href="/dashboard/recruiter" className="hover:text-teal-600">
              Jobs |
            </Link>
            <Link href="/recruiter/profile" className="hover:text-teal-600">
              Company Profile |
            </Link>
            <Link
              href="/recruiter/profile/change-password" className="hover:text-teal-600"
            >
              Change Password |
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline cursor-pointer"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mt-5 md:mb-6 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Job Posts</h2>
            <p className="text-gray-600 text-md mt-3">
              Manage your posted jobs and applicants
            </p>
          </div>

          <Link
            href="/dashboard/recruiter/create"
            className="bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700 transition text-lg"
          >
            + Post Job
          </Link>
        </div>

        {/* JOB LIST */}
        {loading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-gray-500 mb-4 text-md">
              You haven't posted any jobs yet.
            </p>
            <Link
              href="/dashboard/recruiter/create"
              className="text-teal-600 underline text-md"
            >
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-lg text-gray-800">
                <tr>
                  <th className="p-4">Position</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map(job => (
                  <tr
                    key={job._id}
                    className="border-t border-gray-300 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium md:text-lg">
                      {job.position}
                    </td>
                    <td className="p-4 text-gray-600 md:text-lg">
                      {job.location}
                    </td>
                    <td className="p-4 text-gray-600 md:text-lg">
                      {job.contract}
                    </td>
                    <td className="p-4 flex gap-4 md:text-md text-sm">
                      <Link
                        href={`/dashboard/recruiter/edit/${job._id}`}
                        className="text-teal-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/dashboard/recruiter/jobs/${job._id}/applicants`}
                        className="text-blue-600 hover:underline"
                      >
                        Applicants
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
