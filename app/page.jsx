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
import { ModelProvider } from "@/components/model-context"
import GlobalModelOverlay from "@/components/global-model-overlay"
import ModelControls from "@/components/model-controls"

export default function Home() {
  const [showLoading, setShowLoading] = useState(true)
  const [userName, setUserName] = useState("")

  const handleLoadingComplete = (name) => {
    setUserName(name)
    setShowLoading(false)
  }

  return (
    <>
      {showLoading && <LoadingPage onComplete={handleLoadingComplete} />}

      {!showLoading && (
        <ModelProvider>
          <main className="bg-black text-white relative">
            <NetworkEffect />
            <GlobalModelOverlay />
            <ModelControls />

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
        </ModelProvider>
      )}
    </>
  )
}
