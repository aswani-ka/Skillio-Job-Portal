"use client"

import Link from "next/link"

export default function JobSeekerDashboard() {
  return (
    <div className="font-league-spartan">
      <h1 className="md:text-4xl text-3xl text-teal-800 font-bold mb-25">
        Welcome back 👋
      </h1>

      <div className="flex justify-around flex-wrap gap-10">
        {/* Browse Jobs */}
        <Link
          href="/jobs"
          className="bg-white p-12 rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-2xl font-semibold mb-2">
            Browse Jobs
          </h2>
          <p className="text-gray-600 text-md">
            Find and apply for new job opportunities
          </p>
        </Link>

        {/* Applications */}
        <Link
          href="/dashboard/jobseeker/applications"
          className="bg-white p-12 rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-2xl font-semibold mb-2">
            My Applications
          </h2>
          <p className="text-gray-600 text-md">
            Track your applied jobs and status
          </p>
        </Link>
      </div>
    </div>
  )
}
