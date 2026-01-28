"use client"

import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export default function ApplyJobPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [resume, setResume] = useState<File | null>(null)
  const [coverLetter, setCoverLetter] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    const formData = new FormData()
    if (resume) formData.append("resume", resume)
    if (coverLetter) formData.append("coverLetter", coverLetter)

    try {
      await axios.post(`/api/jobs/${id}/apply`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Applied successfully 🎉")
      router.push("/dashboard/jobseeker")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to apply")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl text-teal-800 font-semibold mb-2">Apply for this Job</h1>
        <p className="text-sm text-gray-600 mb-6">
          Submit your application details below
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cover Letter */}
          <div>
            <label className="block text-md font-medium mb-1">
              Cover Letter <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={7}
              placeholder="Write a short cover letter..."
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-md font-medium mb-1">
              Resume <span className="text-gray-400">(PDF only)</span>
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="w-full border rounded-lg p-2 file:bg-teal-600 file:text-white file:px-4 file:py-2 file:rounded-lg cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              If you don't upload a resume, we'll use the one from your profile.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Applying..." : "Apply Now"}
          </button>
        </form>
      </div>
    </section>
  )
}
