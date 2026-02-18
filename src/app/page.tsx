import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 text-white font-league-spartan">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-5 max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-3xl font-bold tracking-wide">
          <span className="text-teal-200">S</span>killio{" "}
          <span className="hidden sm:inline">Job</span>
          <span className="text-teal-200">Portal</span>
        </h1>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/login"
            className="px-3 sm:px-4 py-2 rounded text-sm sm:text-lg hover:bg-white/10 transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-4 sm:px-5 py-2 text-sm sm:text-lg bg-white text-teal-700 rounded font-semibold hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 mt-12 sm:mt-20 animate-fadeIn">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight">
          Find Your <span className="text-teal-200">Dream Job</span>
        </h2>

        <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl max-w-2xl text-white/90">
          Explore thousands of job opportunities from top companies.
          Apply easily and track your applications in one place.
        </p>

        {/* CTA BUTTONS */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/jobs"
            className="w-full sm:w-auto bg-white text-teal-700 px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:scale-[1.02] transition"
          >
            Browse Jobs
          </Link>

          <Link
            href="/signup"
            className="w-full sm:w-auto border border-white px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-white hover:text-teal-700 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-16 sm:mt-28 max-w-6xl mx-auto px-4 sm:px-6 grid gap-6 md:grid-cols-3 text-center">
        <div className="bg-white/10 p-6 rounded-xl backdrop-blur hover:scale-[1.02] transition">
          <h3 className="text-lg sm:text-2xl font-semibold mb-2">
            Verified Jobs
          </h3>
          <p className="text-white/80 text-sm sm:text-base">
            Only genuine recruiters and trusted companies.
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl backdrop-blur hover:scale-[1.02] transition">
          <h3 className="text-lg sm:text-2xl font-semibold mb-2">
            Easy Applications
          </h3>
          <p className="text-white/80 text-sm sm:text-base">
            Apply with your profile and resume in one click.
          </p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl backdrop-blur hover:scale-[1.02] transition">
          <h3 className="text-lg sm:text-2xl font-semibold mb-2">
            Track Status
          </h3>
          <p className="text-white/80 text-sm sm:text-base">
            Know whether you are shortlisted or rejected.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-25 sm:mt-50 text-center text-xs sm:text-sm text-white/70 pb-8 px-4">
        © {new Date().getFullYear()} Skillio JobPortal. All rights reserved.
      </footer>
    </main>
  )
}
