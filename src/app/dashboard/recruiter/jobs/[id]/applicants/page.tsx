"use client"

import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"

type Status = "PENDING" | "SHORTLISTED" | "REJECTED"

interface Applicant {
  _id: string
  applicant: {
    name: string
    email: string
  }
  resumeUrl: string
  coverLetter: string
  status: Status
}

export default function RecruiterApplicantsPage() {
  const { id } = useParams()

  const [applications, setApplications] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Status | "ALL">("ALL")

  useEffect(() => {
    fetchApplicants()
  }, [])

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(
        `/api/recruiter/jobs/${id}/applications`,
        { withCredentials: true }
      )
      setApplications(res.data)
    } catch {
      toast.error("Failed to load applicants")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (
    applicationId: string,
    status: Exclude<Status, "PENDING">
  ) => {
    try {
      await axios.put(
        `/api/recruiter/jobs/${id}/applications`,
        { applicationId, status },
        { withCredentials: true }
      )

      setApplications(prev =>
        prev.map(app =>
          app._id === applicationId ? { ...app, status } : app
        )
      )

      toast.success(
        status === "SHORTLISTED"
          ? "Applicant shortlisted"
          : "Applicant rejected"
      )
    } catch {
      toast.error("Failed to update application")
    }
  }

  const filteredApplications = useMemo(() => {
    if (filter === "ALL") return applications
    return applications.filter(app => app.status === filter)
  }, [applications, filter])

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 font-league-spartan">
        Loading applicants...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 font-league-spartan">
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-800">
            Applicants
          </h1>
          <p className="text-gray-600 mt-4">
            Review, shortlist, or reject candidates for this role
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-6">
          {["ALL", "PENDING", "SHORTLISTED", "REJECTED"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-1.5 rounded-full text-md font-medium border cursor-pointer
                ${
                  filter === status
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">
              No applicants found for this filter.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredApplications.map(app => (
              <div
                key={app._id}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {app.applicant.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {app.applicant.email}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
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

                {/* COVER LETTER */}
                {app.coverLetter && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-1">
                      Cover Letter
                    </h3>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                      {app.coverLetter}
                    </p>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 font-medium text-sm hover:underline"
                  >
                    View Resume
                  </a>

                  {app.status === "PENDING" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          updateStatus(app._id, "SHORTLISTED")
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Shortlist
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(app._id, "REJECTED")
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
