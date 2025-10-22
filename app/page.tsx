"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import About from "@/components/about"
import Skills from "@/components/skills"
import Education from "@/components/education"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import LoadingPage from "@/components/loading-page"
import NetworkEffect from "@/components/network-effect"

export default function Home() {
  const [showLoading, setShowLoading] = useState(true)
  const [userName, setUserName] = useState("")

  const handleLoadingComplete = (name: string) => {
    setUserName(name)
    setShowLoading(false)
  }

  return (
    <>
      {showLoading && <LoadingPage onComplete={handleLoadingComplete} />}

      {!showLoading && (
        <main className="bg-black text-white relative">
          <NetworkEffect />

          <div className="relative z-10">
            <Navigation userName={userName} />
            <Hero userName={userName} />
            <About />
            <Skills />
            <Education />
            <Projects />
            <Contact />
          </div>
        </main>
      )}
    </>
  )
}