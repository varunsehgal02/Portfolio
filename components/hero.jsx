"use client"

import { useEffect, useRef } from "react"
import MouseFollowingModel from "./mouse-following-model"

export default function Hero({ userName }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    // Create enhanced floating particles with better properties
    const createParticles = () => {
      const particles = []
      const particleCount = 50

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 4 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          color: Math.random() > 0.5 ? '#ef4444' : '#3b82f6',
          pulse: Math.random() * Math.PI * 2,
          originalRadius: Math.random() * 4 + 1,
          hoverIntensity: Math.random() * 0.5 + 0.5,
          trail: []
        })
      }

      return particles
    }

    particlesRef.current = createParticles()

    // Mouse tracking
    const handleMouseMove = (event) => {
      mouseRef.current.x = event.clientX
      mouseRef.current.y = event.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", resizeCanvas)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      // Enhanced particle update and drawing
      particles.forEach((particle, index) => {
        // Update pulse
        particle.pulse += 0.02
        
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Enhanced mouse interaction with multiple zones
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          const force = (150 - distance) / 150
          const attractionForce = force * particle.hoverIntensity * 0.02
          
          // Smooth attraction to mouse (slower)
          particle.vx += (dx / distance) * attractionForce * 0.5
          particle.vy += (dy / distance) * attractionForce * 0.5
          
          // Dynamic radius based on distance
          particle.radius = particle.originalRadius + force * 3 + Math.sin(particle.pulse) * 1
          
          // Enhanced opacity
          particle.opacity = Math.min(1, particle.opacity + force * 0.3)
          
          // Add to trail
          particle.trail.push({ x: particle.x, y: particle.y, opacity: force })
          if (particle.trail.length > 8) particle.trail.shift()
        } else {
          // Reset properties
          particle.radius = particle.originalRadius + Math.sin(particle.pulse) * 0.5
          particle.opacity = Math.max(0.3, particle.opacity - 0.01)
          
          // Clear trail
          if (particle.trail.length > 0) particle.trail.shift()
        }

        // Velocity damping
        particle.vx *= 0.98
        particle.vy *= 0.98

        // Bounce off walls with energy loss
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.8
          particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.8
          particle.y = Math.max(0, Math.min(canvas.height, particle.y))
        }

        // Draw particle trail
        particle.trail.forEach((point, i) => {
          const trailOpacity = point.opacity * (i / particle.trail.length) * 0.3
          ctx.save()
          ctx.shadowColor = particle.color
          ctx.shadowBlur = 5
          ctx.fillStyle = particle.color
          ctx.globalAlpha = trailOpacity
          ctx.beginPath()
          ctx.arc(point.x, point.y, particle.radius * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })

        // Draw main particle with enhanced glow
        ctx.save()
        ctx.shadowColor = particle.color
        ctx.shadowBlur = 15 + Math.sin(particle.pulse) * 5
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Enhanced connections with dynamic styling
      ctx.strokeStyle = "rgba(239, 68, 68, 0.15)"
      ctx.lineWidth = 1.5

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 140) {
            const opacity = 1 - distance / 140
            ctx.globalAlpha = opacity * 0.6
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      // Enhanced connections to mouse with gradient effect
      particles.forEach((particle) => {
        const dx = particle.x - mouseRef.current.x
        const dy = particle.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 180) {
          const opacity = 0.8 - distance / 180
          const gradient = ctx.createLinearGradient(particle.x, particle.y, mouseRef.current.x, mouseRef.current.y)
          gradient.addColorStop(0, `rgba(239, 68, 68, ${opacity})`)
          gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity * 0.5})`)
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 2 + opacity * 2
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
          ctx.stroke()
        }
      })
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleScroll = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="home"
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Interactive Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "transparent" }}
      />

      {/* Enhanced Background Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-600/5 to-blue-600/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="flex flex-col gap-6 animate-fade-in-up">
          <div>
            <p className="text-red-500 font-semibold mb-2 text-lg animate-text-glow">Hi, I'm Varun Sehgal 👋</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance leading-tight">
              Frontend & <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 animate-gradient-text">UI/UX</span> Developer
            </h1>
            <p className="text-xl text-gray-300 mb-6 text-balance leading-relaxed hover:text-white transition-colors duration-300">
              I craft modern, responsive web applications with a focus on user experience and clean design. Specializing
              in React, Tailwind CSS, and Three.js.
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => handleScroll("#projects")}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-600/50 hover:shadow-2xl group"
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
            <button
              onClick={() => handleScroll("#contact")}
              className="px-8 py-3 border-2 border-red-600 text-white hover:bg-red-600/10 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 hover:border-red-500 hover:shadow-lg hover:shadow-red-600/25"
            >
              Get In Touch
            </button>
          </div>

          {/* Enhanced Social Links */}
          <div className="flex gap-6 pt-4">
            {[
              { name: "GitHub", href: "https://github.com/varunsehgal02", icon: "🐙" },
              { name: "LinkedIn", href: "https://linkedin.com/in/varunsehgal02", icon: "💼" },
              { name: "X", href: "https://x.com/varunsehgal02", icon: "🐦" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-all duration-300 font-medium group flex items-center gap-2 hover:scale-110 transform"
              >
                <span className="text-lg group-hover:animate-bounce">{social.icon}</span>
                {social.name}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden md:block h-screen md:h-96 lg:h-[500px] animate-fade-in-right">
          <MouseFollowingModel />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes gradient-text {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.6);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out 0.2s both;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 3s ease-in-out infinite;
        }

        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
