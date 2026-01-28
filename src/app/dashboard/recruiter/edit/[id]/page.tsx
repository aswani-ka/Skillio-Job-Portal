"use client"

import axios from "axios"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface JobForm {
  company: string
  position: string
  role: string
  level: string
  contract: string
  location: string
  description: string
  languages: string
  tools: string
  featured: boolean
}

export default function EditJobPage() {
  const router = useRouter()
  const { id } = useParams()

  const [form, setForm] = useState<JobForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchJob()
  }, [])

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/api/recruiter/jobs/${id}`, {
        withCredentials: true,
      })
      setForm(res.data)
    } catch {
      toast.error("Unable to load job details")
      router.push("/dashboard/recruiter")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!form) return
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setForm(prev => ({
      ...prev!,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return

    try {
      setSaving(true)
      await axios.put(`/api/recruiter/jobs/${id}`, form, {
        withCredentials: true,
      })
      toast.success("Job updated successfully")
      router.push("/dashboard/recruiter")
      router.refresh()
    } catch {
      toast.error("Failed to update job")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading job details...
      </div>
    )
  }

  if (!form) return null

  return (
    <main className="min-h-screen bg-gray-50 py-10 font-league-spartan">
      <div className="max-w-4xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-800">
            Edit Job Posting
          </h1>
          <p className="text-gray-600 mt-4">
            Update job details visible to candidates
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-xl p-6 space-y-8"
        >
          {/* BASIC INFO */}
          <section>
            <h2 className="text-lg font-semibold mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company Name"
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none text-lg"
              />

              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Job Position"
                required
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none text-lg"
              />
            </div>
          </section>

          {/* ROLE DETAILS */}
          <section>
            <h2 className="text-lg font-semibold mb-4">
              Role Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 text-lg"
              >
                <option>Frontend</option>
                <option>Backend</option>
                <option>Fullstack</option>
              </select>

              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 text-lg"
              >
                <option>Junior</option>
                <option>Midweight</option>
                <option>Senior</option>
              </select>

              <select
                name="contract"
                value={form.contract}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 text-lg"
              >
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Contract</option>
              </select>
            </div>

            <div className="mt-4">
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location (Remote / City)"
                className="w-full border rounded-lg px-3 py-2 text-lg"
              />
            </div>
          </section>

          {/* DESCRIPTION */}
          <section>
            <h2 className="text-lg font-semibold mb-4">
              Job Description
            </h2>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Responsibilities, requirements, and expectations"
              required
              className="w-full border rounded-lg px-3 py-3 min-h-[140px] text-lg"
            />
          </section>

          {/* SKILLS */}
          <section>
            <h2 className="text-lg font-semibold mb-4">
              Skills & Tools
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="languages"
                value={form.languages}
                onChange={handleChange}
                placeholder="Languages (e.g. JavaScript, Python)"
                className="border rounded-lg px-3 py-2 text-lg"
              />

              <input
                name="tools"
                value={form.tools}
                onChange={handleChange}
                placeholder="Tools (e.g. React, Node, Git)"
                className="border rounded-lg px-3 py-2 text-lg"
              />
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex items-center justify-between pt-4">
            <label className="flex items-center gap-2 text-md">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />
              Feature this job
            </label>

            <button
              type="submit"
              disabled={saving}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50 cursor-pointer text-lg"
            >
              {saving ? "Updating..." : "Update Job"}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
