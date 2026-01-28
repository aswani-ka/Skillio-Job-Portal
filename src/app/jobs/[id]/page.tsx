"use client"

import axios from "axios"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function JobDetailsPage() {
  const { id } = useParams()

  const [job, setJob] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await axios.get(`/api/jobs/${id}`)
        setJob(jobRes.data)

        try {
          const userRes = await axios.get("/api/auth/me", {
            withCredentials: true
          })
          setIsLoggedIn(true)
          setRole(userRes.data.user.role)
        } catch {
          setIsLoggedIn(false)
          setRole(null)
        }
      } catch (error) {
        console.error("Failed to fetch job", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-500">
        Loading job details...
      </p>
    )
  }

  if (!job) {
    return (
      <p className="p-6 text-center text-red-500">
        Job not found
      </p>
    )
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      {/* Job Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold">{job.position}</h1>
        <p className="text-gray-600 mt-3">{job.company}</p>

        <div className="flex flex-wrap gap-3 mt-4 text-sm">
          <span className="px-3 py-1 bg-gray-100 rounded">
            📍 {job.location}
          </span>
          <span className="px-3 py-1 bg-gray-100 rounded">
            💼 {job.role}
          </span>
          <span className="px-3 py-1 bg-gray-100 rounded">
            🎓 {job.level}
          </span>
          <span className="px-3 py-1 bg-gray-100 rounded">
            ⏳ {job.contract}
          </span>
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-white rounded-lg shadow p-6 mb-5">
        <h2 className="text-xl font-semibold mb-4">
          Job Description
        </h2>
        <p className="text-gray-700 whitespace-pre-line">
          {job.description}
        </p>
      </div>

      {/* Action Section */}
      <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
        {!isLoggedIn && (
          <Link
            href="/login"
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
          >
            Login to Apply
          </Link>
        )}

        {isLoggedIn && role === "JOB_SEEKER" && (
          <Link
            href={`/jobs/${id}/apply`}
            className="bg-teal-600 text-white px-8 py-3 rounded text-lg font-medium hover:bg-teal-700 transition"
          >
            Apply Now
          </Link>
        )}

        {isLoggedIn && role !== "JOB_SEEKER" && (
          <p className="text-sm text-gray-500">
            Only job seekers can apply for this job
          </p>
        )}
      </div>
    </main>
  )
}
