"use client"

import { useState, useEffect, useRef } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
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

    // Create floating particles
    const createParticles = () => {
      const particles = []
      const particleCount = 15

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.1,
          color: Math.random() > 0.5 ? '#ef4444' : '#3b82f6',
          pulse: Math.random() * Math.PI * 2
        })
      }

      return particles
    }

    particlesRef.current = createParticles()

    window.addEventListener("resize", resizeCanvas)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.pulse += 0.01

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Draw particle with pulsing effect
        const pulseSize = particle.radius + Math.sin(particle.pulse) * 0.3
        ctx.save()
        ctx.shadowColor = particle.color
        ctx.shadowBlur = 6
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity + Math.sin(particle.pulse) * 0.1
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw connections
      ctx.strokeStyle = "rgba(239, 68, 68, 0.08)"
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 80) {
            ctx.globalAlpha = 1 - distance / 80
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Interactive Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "transparent" }}
      />

      {/* Enhanced Background Effects */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-red-600/3 to-blue-600/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-white animate-fade-in-up">
          Let's Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 animate-gradient-text">Together</span>
        </h2>
        <p className="text-xl text-gray-300 mb-12 text-balance animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          I'm always interested in hearing about new projects and opportunities. Feel free to reach out!
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Enhanced Contact Form */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">Send me a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="group">
                <label className="block text-sm font-medium text-white mb-2 group-hover:text-red-400 transition-colors duration-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2 bg-gray-900/50 border-2 border-red-600/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-red-600 transition-all duration-300 hover:bg-gray-900/70 hover:border-red-600/40 group-hover:shadow-lg group-hover:shadow-red-600/20"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-white mb-2 group-hover:text-red-400 transition-colors duration-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-gray-900/50 border-2 border-red-600/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-red-600 transition-all duration-300 hover:bg-gray-900/70 hover:border-red-600/40 group-hover:shadow-lg group-hover:shadow-red-600/20"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-white mb-2 group-hover:text-red-400 transition-colors duration-300">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  rows="5"
                  className="w-full px-4 py-2 bg-gray-900/50 border-2 border-red-600/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-red-600 transition-all duration-300 resize-none hover:bg-gray-900/70 hover:border-red-600/40 group-hover:shadow-lg group-hover:shadow-red-600/20"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-600/50 hover:shadow-2xl group relative overflow-hidden"
              >
                <span className="relative z-10">{submitted ? "✓ Message Sent!" : "Send Message"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </button>
            </form>
          </div>

          {/* Enhanced Contact Info */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">Get in touch</h3>

            <div className="space-y-6">
              {[
                { 
                  label: "Email", 
                  value: "varun.sehgal02@gmail.com", 
                  href: "mailto:varun.sehgal02@gmail.com",
                  icon: "📧" 
                },
                { 
                  label: "Phone", 
                  value: "+91 9399361193", 
                  href: "tel:+919399361193",
                  icon: "📞" 
                }
              ].map((item, index) => (
                <div key={index} className="p-4 bg-gray-900/50 rounded-lg border-2 border-red-600/20 hover:border-red-600 transition-all duration-300 group hover:bg-gray-900/70 hover:shadow-lg hover:shadow-red-600/20">
                  <p className="text-sm text-gray-400 mb-1 flex items-center gap-2 group-hover:text-red-400 transition-colors duration-300">
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </p>
                  <a
                    href={item.href}
                    className="text-lg font-semibold text-white hover:text-red-500 transition-colors duration-300 group-hover:text-red-400"
                  >
                    {item.value}
                  </a>
                </div>
              ))}

              <div>
                <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                  <span className="text-lg">🌐</span>
                  Social Links
                </p>
                <div className="flex gap-4">
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
                      className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 group flex items-center gap-2"
                    >
                      <span className="text-lg group-hover:animate-bounce">{social.icon}</span>
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-red-600/20">
              <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                © 2025 Varun Sehgal. All rights reserved. | Built with React, Tailwind CSS & Three.js
              </p>
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
      `}</style>
    </section>
  )
}
