"use client"

import { useState, useEffect, useRef } from "react"

export default function LoadingPage({ onComplete }) {
  const [displayText, setDisplayText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const welcomeText = "Welcome to my portfolio - Varun Sehgal"
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < welcomeText.length) {
        setDisplayText(welcomeText.substring(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    const particles = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 40 + 20,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      color: ["#ef4444", "#ff6b6b", "#ff8787"][Math.floor(Math.random() * 3)],
    }))

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        if (p.x < -p.size) p.x = canvas.width + p.size
        if (p.x > canvas.width + p.size) p.x = -p.size
        if (p.y < -p.size) p.y = canvas.height + p.size
        if (p.y > canvas.height + p.size) p.y = -p.size

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        ctx.strokeStyle = p.color
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.6

        // Draw rotating cube outline
        const s = p.size / 2
        ctx.strokeRect(-s, -s, p.size, p.size)
        ctx.beginPath()
        ctx.moveTo(-s, -s)
        ctx.lineTo(s, s)
        ctx.moveTo(s, -s)
        ctx.lineTo(-s, s)
        ctx.stroke()

        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => resizeCanvas()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleEnter = () => {
    setIsLoading(true)
    setTimeout(() => {
      onComplete("Varun Sehgal")
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white h-20 flex items-center justify-center">
            <span className="inline-block">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          <p className="text-gray-400 text-xl animate-fade-in-delay mt-10">Let's explore my work</p>

          <button
            onClick={handleEnter}
            disabled={isLoading}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed shadow-lg shadow-red-600/50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span> Loading...
              </span>
            ) : (
              "Enter Portfolio"
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1.5s ease-out;
        }
      `}</style>
    </div>
  )
}
