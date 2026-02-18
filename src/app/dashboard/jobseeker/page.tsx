"use client"

import Link from "next/link"

export default function JobSeekerDashboard() {
  return (
    <div className="font-league-spartan">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-teal-800">
          Welcome back 👋
        </h2>
        <p className="text-gray-600 mt-2">
          Explore jobs and track your applications easily.
        </p>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/jobs"
          className="bg-white p-8 rounded-xl border hover:shadow-lg transition group"
        >
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-teal-700">
            Browse Jobs
          </h3>
          <p className="text-gray-600 mt-2 text-sm">
            Find and apply for new job opportunities
          </p>
        </Link>

        <Link
          href="/dashboard/jobseeker/applications"
          className="bg-white p-8 rounded-xl border hover:shadow-lg transition group"
        >
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-teal-700">
            My Applications
          </h3>
          <p className="text-gray-600 mt-2 text-sm">
            Track your applied jobs and status
          </p>
        </Link>

        <Link
          href="/profile/jobseeker"
          className="bg-white p-8 rounded-xl border hover:shadow-lg transition group"
        >
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-teal-700">
            My Profile
          </h3>
          <p className="text-gray-600 mt-2 text-sm">
            Update skills, resume and personal details
          </p>
        </Link>
      </div>
    </div>
  )
}
