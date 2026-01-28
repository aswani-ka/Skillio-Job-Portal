"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export default function CreateJobPage() {
  const router = useRouter()
  const [logo, setLogo] = useState<File | null>(null)

  const [form, setForm] = useState({
    company: "",
    position: "",
    role: "Frontend",
    level: "Junior",
    contract: "Full Time",
    location: "",
    description: "",
    languages: "",
    tools: "",
    featured: false,
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!logo) {
      toast.error("Company logo is required")
      return
    }

    const data = new FormData()
    data.append("logo", logo)
    Object.entries(form).forEach(([key, value]) =>
      data.append(key, String(value))
    )

    try {
      await axios.post("/api/recruiter/jobs", data, {
        withCredentials: true,
      })

      toast.success("Job posted successfully")
      router.push("/dashboard/recruiter")
      router.refresh()
    } catch {
      toast.error("Failed to post job")
    }
  }

  const input =
    "w-full border text-lg rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-league-spartan">
      <main className="max-w-4xl mx-auto bg-white shadow rounded-lg p-8">
        <h1 className="text-3xl text-teal-800 font-bold mb-3">Post a New Job</h1>
        <p className="text-md text-gray-700 mb-8">
          Fill in the details below to publish your job listing
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* LOGO */}
          <div>
            <label className="block text-lg font-medium mb-2">
              Company Logo
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
              className="block w-full text-lg
              file:bg-teal-600 file:text-white file:px-4
              file:py-2 file:rounded file:border-0"
            />
          </div>

          {/* COMPANY + POSITION */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-lg font-medium">Company Name</label>
              <input
                type="text"
                name="company"
                required
                onChange={handleChange}
                className={input}
              />
            </div>

            <div>
              <label className="text-lg font-medium">Job Position</label>
              <input
                type="text"
                name="position"
                required
                onChange={handleChange}
                className={input}
              />
            </div>
          </div>

          {/* SELECTS */}
          <div className="grid md:grid-cols-3 gap-4">
            <select name="role" onChange={handleChange} className={input}>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Fullstack</option>
            </select>

            <select name="level" onChange={handleChange} className={input}>
              <option>Junior</option>
              <option>Midweight</option>
              <option>Senior</option>
            </select>

            <select name="contract" onChange={handleChange} className={input}>
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Contract</option>
            </select>
          </div>

          {/* LOCATION */}
          <input
            type="text"
            name="location"
            required
            onChange={handleChange}
            placeholder="Location"
            className={input}
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            required
            rows={6}
            onChange={handleChange}
            className={input}
            placeholder={`• Responsibilities\n• Requirements\n• Benefits`}
          />

          {/* TAGS */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="languages"
              onChange={handleChange}
              placeholder="Languages (comma separated)"
              className={input}
            />

            <input
              type="text"
              name="tools"
              onChange={handleChange}
              placeholder="Tools (comma separated)"
              className={input}
            />
          </div>

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
              className="bg-teal-600 text-lg text-white px-8 py-3 rounded-md
              hover:bg-teal-700 transition font-medium cursor-pointer"
            >
              Publish Job
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
