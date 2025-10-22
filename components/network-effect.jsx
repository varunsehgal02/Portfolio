"use client"

import { useEffect, useRef } from "react"

export default function NetworkEffect() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)
  const colorRef = useRef({ r: 239, g: 68, b: 68 })

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

    // Create enhanced particles with mouse interaction
    const createParticles = () => {
      const particles = []
      const particleCount = 80

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2.0,
          vy: (Math.random() - 0.5) * 2.0,
          radius: Math.random() * 3.5 + 1.5,
          opacity: Math.random() * 0.8 + 0.5,
          pulse: Math.random() * Math.PI * 2,
          hoverIntensity: Math.random() * 0.8 + 0.6,
          originalRadius: Math.random() * 3.5 + 1.5,
          color: Math.random() * 360,
          energy: Math.random() * 0.7 + 0.3
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

    const handleScroll = () => {
      scrollRef.current = window.scrollY
      // Change color randomly on scroll
      if (Math.random() > 0.95) {
        colorRef.current = {
          r: Math.floor(Math.random() * 256),
          g: Math.floor(Math.random() * 256),
          b: Math.floor(Math.random() * 256),
        }
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("scroll", handleScroll)

    // Animation loop
    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current
      const color = colorRef.current

      // Enhanced particle update and drawing
      particles.forEach((particle, index) => {
        // Update pulse
        particle.pulse += 0.02
        
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Enhanced mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          const force = (120 - distance) / 120
          const attractionForce = force * particle.hoverIntensity * 0.015
          
          // Smooth attraction to mouse (slower)
          particle.vx += (dx / distance) * attractionForce * 0.6
          particle.vy += (dy / distance) * attractionForce * 0.6
          
          // Dynamic radius based on distance
          particle.radius = particle.originalRadius + force * 2 + Math.sin(particle.pulse) * 0.5
          
          // Enhanced opacity
          particle.opacity = Math.min(1, particle.opacity + force * 0.2)
        } else {
          // Reset properties
          particle.radius = particle.originalRadius + Math.sin(particle.pulse) * 0.3
          particle.opacity = Math.max(0.4, particle.opacity - 0.005)
        }

        // Velocity damping
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Bounce off walls with energy loss
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.9
          particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.9
          particle.y = Math.max(0, Math.min(canvas.height, particle.y))
        }

        // Draw particle with enhanced glow
        ctx.save()
        ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`
        ctx.shadowBlur = 8 + Math.sin(particle.pulse) * 3
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Enhanced connections with dynamic styling
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`
      ctx.lineWidth = 1.5

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 160) {
            const opacity = 1 - distance / 160
            ctx.globalAlpha = opacity * 0.7
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
          const opacity = 0.9 - distance / 180
          const gradient = ctx.createLinearGradient(particle.x, particle.y, mouseRef.current.x, mouseRef.current.y)
          gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`)
          gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.3})`)
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = 2 + opacity * 2
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
          ctx.stroke()
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}
