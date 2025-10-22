"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import About from "@/components/about"
import Skills from "@/components/skills"
import Education from "@/components/education"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import LoadingPage from "@/components/loading-page"
import NetworkEffect from "@/components/network-effect"
import Collapsible3DModel from "@/components/collapsible-3d-model"

export default function Home() {
  const [showLoading, setShowLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleLoadingComplete = (name: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setUserName(name)
      setShowLoading(false)
      setIsTransitioning(false)
    }, 800)
  }

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // Add custom cursor effect
    const cursor = document.createElement('div')
    cursor.className = 'custom-cursor'
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(239,68,68,0.8) 0%, rgba(59,130,246,0.4) 100%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transition: transform 0.1s ease;
    `
    document.body.appendChild(cursor)

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX - 10 + 'px'
      cursor.style.top = e.clientY - 10 + 'px'
    }

    const handleMouseEnter = () => {
      cursor.style.transform = 'scale(1.5)'
    }

    const handleMouseLeave = () => {
      cursor.style.transform = 'scale(1)'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.body.removeChild(cursor)
    }
  }, [])

  return (
    <>
      {showLoading && <LoadingPage onComplete={handleLoadingComplete} />}

      {!showLoading && (
        <main className={`bg-black text-white relative transition-all duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <NetworkEffect />

          {/* Enhanced background effects */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-900/5 via-transparent to-blue-900/5 animate-gradient-shift"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/3 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative z-10">
            <Navigation userName={userName} />
            <Hero userName={userName} />
            <About />
            <Skills />
            <Education />
            <Projects />
            <Contact />
          </div>

          {/* Collapsible 3D Model */}
          <Collapsible3DModel />

          <style jsx>{`
            @keyframes gradient-shift {
              0%, 100% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
            }

            .animate-gradient-shift {
              background-size: 200% 200%;
              animation: gradient-shift 8s ease-in-out infinite;
            }
          `}</style>
        </main>
      )}
    </>
  )
}