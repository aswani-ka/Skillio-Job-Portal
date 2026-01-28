"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface JobSeekerProfileType {
  bio?: string
  skills?: string[]
  experience?: string
  linkedin?: string
  github?: string
  resumeUrl?: string
}

export default function JobSeekerProfile() {
  const [profile, setProfile] = useState<JobSeekerProfileType | null>(null)
  const [resume, setResume] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    axios
      .get("/api/profile/jobseeker", { withCredentials: true })
      .then(res => {
        setProfile({
          ...res.data,
          skills: Array.isArray(res.data.skills) ? res.data.skills : [],
        })
      })
      .catch(() => toast.error("Failed to load profile"))
  }, [])

  if (!profile) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading profile...
      </p>
    )
  }

  /* ================= HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile(prev => ({
      ...prev!,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({
      ...prev!,
      skills: e.target.value
        .split(",")
        .map(s => s.trim())
        
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()

    Object.entries(profile).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        data.append(key, JSON.stringify(value))
      } else if (value) {
        data.append(key, value)
      }
    })

    if (resume) data.append("resume", resume)

    try {
      await axios.put("/api/profile/jobseeker", data, {
        withCredentials: true,
      })
      toast.success("Profile updated successfully")
    } catch {
      toast.error("Profile update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-league-spartan">
      <h1 className="text-4xl text-teal-800 font-bold mb-8">My Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-4"
      >
        {/* BIO */}
        <div>
          <label className="block text-lg text-gray-800 font-semibold mb-1">Bio</label>
          <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
            rows={4}
            placeholder="Tell recruiters about yourself..."
            className="w-full border p-3 rounded focus:outline-none focus:ring-1 focus:ring-teal-600 text-lg"
          />
        </div>

        {/* SKILLS */}
        <div>
          <label className="block text-lg text-gray-800 font-semibold mb-1">Skills</label>
          <input
            type="text"
            placeholder="React, Node.js, MongoDB"
            value={profile.skills?.join(", ") || ""}
            onChange={handleSkillsChange}
            className="w-full border p-3 rounded focus:outline-none focus:ring-1 focus:ring-teal-600 text-lg"
          />
        </div>

        {/* EXPERIENCE */}
        <div>
          <label className="block text-lg text-gray-800 font-semibold mb-1">Experience</label>
          <textarea
            name="experience"
            rows={4}
            placeholder="Your work experience..."
            value={profile.experience || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded focus:outline-none focus:ring-1 focus:ring-teal-600 text-lg"
          />
        </div>

        {/* LINKS */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg text-gray-800 font-semibold mb-1">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              placeholder="https://linkedin.com/in/username"
              value={profile.linkedin || ""}
              onChange={handleChange}
              className="w-full border p-3 rounded focus:outline-none focus:ring-1 focus:ring-teal-600 text-lg"
            />
          </div>

          <div>
            <label className="block text-lg text-gray-800 font-semibold mb-1">GitHub</label>
            <input
              type="text"
              name="github"
              placeholder="https://github.com/username"
              value={profile.github || ""}
              onChange={handleChange}
              className="w-full border p-3 rounded focus:outline-none focus:ring-1 focus:ring-teal-600 text-lg"
            />
          </div>
        </div>

        {/* RESUME */}
        <div>
          <label className="block text-lg text-gray-800 font-semibold mb-2">Resume (PDF)</label>
          <div className="flex gap-25">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                className="text-gray-800 p-2 file:bg-teal-600 file:text-white file:px-4 file:py-2 file:rounded text-lg"
              />
              {profile.resumeUrl && (
                <p className="mt-2 text-lg">
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    className="text-teal-600 underline"
                  >
                    View current resume
                  </a>
                </p>
              )}
          </div>
        </div>

        {/* SUBMIT */}
        <div className="pt-4 flex justify-center items-center">
          <button
            disabled={loading}
            className="bg-teal-600 text-white px-8 py-2 rounded hover:bg-teal-700 transition disabled:opacity-60 cursor-pointer text-lg"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  )
}

