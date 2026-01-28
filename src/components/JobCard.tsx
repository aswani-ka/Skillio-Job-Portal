"use client"

import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export interface Job {
  _id: string
  logo?: string
  company: string
  position: string
  role: string
  level: string
  contract: string
  location: string
  languages: string[]
  tools: string[]
  featured: boolean
  createdAt: string 
}

export default function JobCard({
  job,
  addFilter,
}: {
  job: Job
  addFilter: (filter: string) => void
}) {
  const tags = [job.role, job.level, ...job.languages, ...job.tools]

  
  const createdDate = new Date(job.createdAt)
  const postedDate =
    !isNaN(createdDate.getTime())
      ? formatDistanceToNow(createdDate, { addSuffix: true })
      : "Recently"

  
  const isNew =
    !isNaN(createdDate.getTime()) &&
    Date.now() - createdDate.getTime() <
      7 * 24 * 60 * 60 * 1000

  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="bg-white p-6 rounded-lg shadow-xl shadow-teal-700/10 border-l-4 border-transparent hover:border-teal-700 transition font-league-spartan mb-10">
        <div className="flex items-center justify-between flex-wrap md:flex-nowrap">

          <div className="grid gap-6 md:flex">
            {/* Logo */}
            <div className="w-14 h-14 md:w-18 md:h-18 relative shrink-0">
              {job.logo ? (
                <Image
                  src={job.logo}
                  alt={job.company}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
                  Logo
                </div>
              )}
            </div>
            {/* Job Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-bold text-md text-teal-700/70">
                  {job.company}
                </h3>
                {isNew && (
                  <span className="bg-teal-700/70 text-white font-bold text-xs
                   px-2 py-1 rounded-full">
                    NEW!
                  </span>
                )}
                {job.featured && (
                  <span className="bg-gray-700 text-white text-sm px-2 py-1 rounded-full">
                    FEATURED
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 hover:text-teal-700 mt-1">
                {job.position}
              </h2>
              <div className="text-gray-500 text-sm flex gap-2 mt-2">
                <span>{postedDate}</span>
                <span>•</span>
                <span>{job.contract}</span>
                <span>•</span>
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div
            className={`flex items-center gap-4 ${
              tags.length > 0 ? "justify-between" : "justify-start"
            }`}
          >
            {/* LEFT CONTENT */}
            <div className="flex items-center gap-4">
              {/* logo + job info */}
            </div>

            {/* RIGHT FILTERS */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={(e) => {
                      e.preventDefault();
                      addFilter(tag);
                    }}
                    className="bg-gray-100 text-teal-700/70 px-3 py-1 text-sm font-semibold rounded hover:bg-teal-700 hover:text-white transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </Link>
  )
}