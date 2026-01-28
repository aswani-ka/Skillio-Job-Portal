"use client"

import Header from "@/components/Header"
import { Job } from "@/components/JobCard"
import JobList from "@/components/JobList"
import FilterBar from "@/components/FilterBar"
import { useEffect, useState } from "react"
import axios from "axios"


export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filters, setFilters] = useState<string[]>([])
  
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [keyword, setKeyword] = useState("")

  useEffect(() => {
    const fetchJobs = async () => {
      const params = new URLSearchParams()

      params.set("page", page.toString())
      params.set("limit", "6")

      if(keyword) params.set("keyword", keyword)

      filters.forEach(filter => {
        params.append("tags", filter)
      })

      const res = await axios.get(`/api/jobs?${params.toString()}`)

      const normalizedJobs = res.data.jobs.map((job: any) => ({
        ...job,
        isNew: job.isNew ?? job.new ?? false
      }))

      setJobs(normalizedJobs)
      setTotalPages(res.data.pagination.totalPages === 0 ? 1 : res.data.pagination.totalPages)
    }

    fetchJobs()
  }, [filters, page, keyword])

  const addFilter = (filter: string) => {
    if(!filters.includes(filter)) {
      setFilters((prev: any) => [...prev, filter])
      setPage(1)
    }
  }

  const removeFilter = (filter: string) => {
    setFilters((prev: any) => prev.filter((f: string) => f !== filter))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters([])
    setPage(1)
  }

  return (
    <main>
      <Header />

    {/* search */}
    <div className="max-w-6xl mx-auto px-4 mt-6 font-league-spartan">
      <input 
        type="text" 
        placeholder="Search for jobs or company..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value)
          setPage(1)
        }}
        className="w-full p-3 border border-gray-500 outline-none focus:ring-1 focus:ring-gray-800 hover:border-gray-800 rounded-md text-lg"
      />
    </div>

      <FilterBar 
        filters={filters}
        removeFilter={removeFilter}
        clearFilters={clearFilters}
      />
      <JobList jobs={jobs} addFilter={addFilter} />

        {/* pagination */}
        <div className="flex justify-center items-center gap-4 my-10 font-league-spartan text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>
          <span className="font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
    </main>
  )
}