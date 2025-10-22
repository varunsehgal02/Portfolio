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

    // Create particles
    const createParticles = () => {
      const particles = []
      const particleCount = 50

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 2 + 1,
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

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Draw particle with dynamic color
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw connections with dynamic color
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.globalAlpha = 1 - distance / 150
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      // Draw connections to mouse with dynamic color
      particles.forEach((particle) => {
        const dx = particle.x - mouseRef.current.x
        const dy = particle.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 200) {
          ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${0.8 - distance / 200})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
          ctx.stroke()

          // Attract particle to mouse
          particle.vx += (mouseRef.current.x - particle.x) * 0.0001
          particle.vy += (mouseRef.current.y - particle.y) * 0.0001
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
