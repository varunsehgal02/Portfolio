"use client"

import { useEffect, useRef } from "react"
import NetworkEffect from "./network-effect"

export default function About() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })

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

    // Create floating particles
    const createParticles = () => {
      const particles = []
      const particleCount = 25

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.4 + 0.1,
          color: Math.random() > 0.5 ? '#ef4444' : '#3b82f6',
          pulse: Math.random() * Math.PI * 2
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

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.pulse += 0.02

        // Slow mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          const force = (120 - distance) / 120
          particle.vx += (dx / distance) * force * 0.003
          particle.vy += (dy / distance) * force * 0.003
        }

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Draw particle with pulsing effect
        const pulseSize = particle.radius + Math.sin(particle.pulse) * 0.5
        ctx.save()
        ctx.shadowColor = particle.color
        ctx.shadowBlur = 8
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity + Math.sin(particle.pulse) * 0.2
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw connections
      ctx.strokeStyle = "rgba(239, 68, 68, 0.1)"
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.globalAlpha = 1 - distance / 100
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900/50 relative overflow-hidden"
    >
      {/* Network Effect Background */}
      <div className="absolute inset-0 w-full h-full opacity-30">
        <NetworkEffect />
      </div>



      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-balance text-white animate-fade-in-up">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 animate-gradient-text">Me</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="group">
              <p className="text-lg text-gray-300 leading-relaxed hover:text-white transition-all duration-300 group-hover:transform group-hover:translate-x-2">
                I'm <span className="text-red-500 font-semibold animate-text-glow">Varun Sehgal</span>, a passionate Frontend & UI/UX
                Developer with a keen eye for creating beautiful, intuitive digital experiences. Currently pursuing B.Tech
                in Computer Science & Engineering at JUET, Guna, I'm in my 3rd year and actively seeking internship
                opportunities.
              </p>
            </div>

            <div className="group">
              <p className="text-lg text-gray-300 leading-relaxed hover:text-white transition-all duration-300 group-hover:transform group-hover:translate-x-2">
                My journey in web development started with a curiosity about how things work on the web. Over time, I've
                honed my skills in React, Tailwind CSS, and interactive 3D experiences with Three.js. I believe in writing
                clean, maintainable code and creating interfaces that are both beautiful and functional.
              </p>
            </div>

            <div className="group">
              <p className="text-lg text-gray-300 leading-relaxed hover:text-white transition-all duration-300 group-hover:transform group-hover:translate-x-2">
                When I'm not coding, you can find me exploring new design trends, contributing to open-source projects, or
                experimenting with new web technologies. I'm always eager to learn and grow as a developer.
              </p>
            </div>
          </div>

          <div
            className="bg-gray-900/50 rounded-lg p-8 border-2 border-red-600/30 hover:border-red-600 transition-all duration-300 animate-fade-in-up transform hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20 group"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-red-400 transition-colors duration-300">Quick Facts</h3>
            <div className="space-y-4">
              {[
                { label: "Location", value: "Guna, Madhya Pradesh, India", icon: "📍" },
                { label: "Status", value: "B.Tech 3rd Year Student", icon: "🎓" },
                { label: "Specialization", value: "Frontend Development & UI/UX Design", icon: "💻" },
                { label: "Phone", value: "+91 9399361193", icon: "📞" },
                { label: "Email", value: "varun.sehgal02@gmail.com", icon: "📧" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="pb-4 border-b border-red-600/20 hover:border-red-600 transition-all duration-300 group/item hover:bg-red-600/5 rounded-lg p-2 -m-2"
                >
                  <p className="text-sm text-gray-400 flex items-center gap-2 group-hover/item:text-red-400 transition-colors duration-300">
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </p>
                  <p className="font-semibold text-white group-hover/item:text-red-300 transition-colors duration-300">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
            opacity: 0.6;
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
            text-shadow: 0 0 15px rgba(239, 68, 68, 0.8), 0 0 25px rgba(239, 68, 68, 0.6);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
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
