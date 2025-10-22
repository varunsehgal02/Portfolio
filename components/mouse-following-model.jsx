"use client"

import { useEffect, useRef } from "react"

export default function MouseFollowingModel({ networkParticles }) {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rotationRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resizeCanvas()

    // Mouse tracking
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = (event.clientX - rect.left) / rect.width
      mouseRef.current.y = (event.clientY - rect.top) / rect.height
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", resizeCanvas)

    const createSphere = (radius, segments) => {
      const vertices = []
      const phi = Math.PI * (3 - Math.sqrt(5))

      for (let i = 0; i < segments; i++) {
        const y = 1 - (i / (segments - 1)) * 2
        const radiusAtY = Math.sqrt(1 - y * y)

        const theta = phi * i

        const x = Math.cos(theta) * radiusAtY
        const z = Math.sin(theta) * radiusAtY

        vertices.push([x * radius, y * radius, z * radius])
      }

      return vertices
    }

    const sphereVertices = createSphere(2, 100)

    // Rotation matrices
    const rotateX = (point, angle) => {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return [point[0], point[1] * cos - point[2] * sin, point[1] * sin + point[2] * cos]
    }

    const rotateY = (point, angle) => {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return [point[0] * cos + point[2] * sin, point[1], -point[0] * sin + point[2] * cos]
    }

    const rotateZ = (point, angle) => {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return [point[0] * cos - point[1] * sin, point[0] * sin + point[1] * cos, point[2]]
    }

    // Project 3D to 2D
    const project = (point) => {
      const scale = 400 / (8 + point[2])
      return [point[0] * scale, point[1] * scale]
    }

    // Animation loop
    const animate = () => {
      // Update rotation based on mouse position
      rotationRef.current.x += (mouseRef.current.y * 2 - rotationRef.current.x) * 0.05
      rotationRef.current.y += (mouseRef.current.x * 2 - rotationRef.current.y) * 0.05

      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Transform vertices
      const transformedVertices = sphereVertices.map((vertex) => {
        let point = [...vertex]
        point = rotateX(point, rotationRef.current.x)
        point = rotateY(point, rotationRef.current.y)
        point = rotateZ(point, Date.now() * 0.0005)
        point[2] += 3
        return point
      })

      // Draw sphere with enhanced gradient effect
      const centerX = canvas.offsetWidth / 2
      const centerY = canvas.offsetHeight / 2

      transformedVertices.forEach((vertex, index) => {
        const p = project(vertex)
        const depth = (vertex[2] - 2) / 4.5
        const size = 3 + depth * 4

        // Create gradient based on depth with more vibrant colors
        const hue = ((index / sphereVertices.length) * 360 + Date.now() * 0.05) % 360
        const brightness = 40 + depth * 60

        ctx.fillStyle = `hsl(${hue}, 100%, ${brightness}%)`
        ctx.shadowColor = "rgba(239, 68, 68, 0.8)"
        ctx.shadowBlur = 12

        ctx.beginPath()
        ctx.arc(p[0] + centerX, p[1] + centerY, size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.shadowColor = "transparent"

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg overflow-hidden border-2 border-red-600 shadow-2xl shadow-red-600/50"
    />
  )
}
