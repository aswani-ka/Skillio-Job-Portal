"use client"

import axios from "axios"
import { useEffect, useState } from "react"

export default function MyApplications() {
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "/api/jobseeker/applications",
          { withCredentials: true }
        )
        setApps(res.data)
      } catch (error) {
        console.error("Failed to fetch applications", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 font-league-spartan">
        <p className="text-gray-500">Loading your applications...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto font-league-spartan p-6">
      <h1 className="md:text-4xl text-3xl text-teal-800 font-bold mb-8">
        My Applications
      </h1>

      {apps.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-800 mb-2 md:text-lg">
            You haven't applied to any jobs yet.
          </p>
          <p className="text-md text-gray-600">
            Start applying to see your applications here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {apps.map((app) => (
            <div
              key={app._id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex sm:flex-row gap-10 md:justify-between sm:items-center"
            >
              {/* LEFT */}
              <div>
                <h2 className="text-xl font-semibold">
                  {app.job.position}
                </h2>
                <p className="text-gray-600 text-sm">
                  {app.job.company}
                </p>
              </div>

              {/* RIGHT */}
              <div className="mt-4 sm:mt-0">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold
                    ${
                      app.status === "PENDING" &&
                      "bg-blue-100 text-blue-700"
                    }
                    ${
                      app.status === "SHORTLISTED" &&
                      "bg-green-100 text-green-700"
                    }
                    ${
                      app.status === "REJECTED" &&
                      "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
