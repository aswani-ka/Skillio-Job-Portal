"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"

interface RecruiterProfile {
  companyName: string
  companyDescription: string
  companyWebsite: string
  companyLocation: string
  companyLogo: string
}

export default function RecruiterProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<RecruiterProfile>({
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    companyLocation: "",
    companyLogo: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/profile/recruiter", {
        withCredentials: true,
      })
      setForm({
        companyName: res.data.companyName || "",
        companyDescription: res.data.companyDescription || "",
        companyWebsite: res.data.companyWebsite || "",
        companyLocation: res.data.companyLocation || "",
        companyLogo: res.data.companyLogo || "",
      })
    } catch {
      console.error("Failed to load company profile")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await axios.put("/api/profile/recruiter", form, {
        withCredentials: true,
      })
      toast.success("Company profile updated successfully")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-gray-500 font-league-spartan">
        Loading company profile...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 font-league-spartan">
      <div className="max-w-5xl mx-auto px-6">
        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-teal-800">
            Company Profile
          </h1>
          <p className="text-gray-600 mt-3 text-md">
            Control how your company appears to candidates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM SECTION */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white shadow rounded-xl p-6 space-y-6"
          >
            {/* BASIC INFO */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-medium mb-1">
                    Company Name
                  </label>
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Eg: Infosys"
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-1">
                    Company Description
                  </label>
                  <textarea
                    name="companyDescription"
                    value={form.companyDescription}
                    onChange={handleChange}
                    placeholder="Tell candidates about your company, culture, and mission"
                    className="w-full border rounded-lg px-3 py-2 min-h-[120px] focus:ring-2 focus:ring-teal-500 outline-none text-lg"
                  />
                </div>
              </div>
            </section>

            {/* COMPANY DETAILS */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Company Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-medium mb-1">
                    Website
                  </label>
                  <input
                    name="companyWebsite"
                    value={form.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://company.com"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium mb-1">
                    Location
                  </label>
                  <input
                    name="companyLocation"
                    value={form.companyLocation}
                    onChange={handleChange}
                    placeholder="Bangalore, India"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none text-lg"
                  />
                </div>
              </div>
            </section>

            {/* BRANDING */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Branding
              </h2>

              <div>
                <label className="block text-lg font-medium mb-1">
                  Company Logo URL
                </label>
                <input
                  name="companyLogo"
                  value={form.companyLogo}
                  onChange={handleChange}
                  placeholder="https://logo.png"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none text-lg"
                />
              </div>
            </section>

            {/* SAVE BUTTON */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50 cursor-pointer text-lg"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          {/* PREVIEW CARD */}
          <aside className="bg-white shadow rounded-xl p-6 h-fit">
            <h3 className="text-2xl font-semibold mb-4 text-teal-800">
              Profile Preview
            </h3>

            <div className="flex items-center gap-4 mb-4">
              {form.companyLogo ? (
                <img
                  src={form.companyLogo}
                  alt="Company Logo"
                  className="h-14 w-14 object-contain border rounded"
                />
              ) : (
                <div className="h-14 w-14 flex items-center justify-center bg-gray-100 rounded text-gray-400 text-lg">
                  Logo
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900 text-lg">
                  {form.companyName || "Company Name"}
                </h4>
                <p className="text-gray-500 text-lg">
                  {form.companyLocation || "Location"}
                </p>
              </div>
            </div>

            <p className="text-md text-gray-600">
              {form.companyDescription || "Company description will appear here."}
            </p>

            {form.companyWebsite && (
              <a
                href={form.companyWebsite}
                target="_blank"
                className="text-teal-600 text-md mt-3 inline-block hover:underline"
              >
                Visit Website →
              </a>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}
