"use client"

import { useEffect, useRef } from "react"
import { useModelContext } from "./model-context"

export default function GlobalModelOverlay() {
  const canvasRef = useRef(null)
  const rotationRef = useRef({ x: 0, y: 0 })
  const modelPosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const { isFollowing, modelColor, globalMousePos } = useModelContext()

  const colorMap = {
    red: "#ef4444",
    yellow: "#eab308",
    blue: "#3b82f6",
    green: "#22c55e",
    white: "#ffffff",
  }

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

    const project = (point) => {
      const scale = 400 / (8 + point[2])
      return [point[0] * scale, point[1] * scale]
    }

    const animate = () => {
      if (isFollowing) {
        modelPosRef.current.targetX = globalMousePos.x
        modelPosRef.current.targetY = globalMousePos.y
        modelPosRef.current.x += (modelPosRef.current.targetX - modelPosRef.current.x) * 0.08
        modelPosRef.current.y += (modelPosRef.current.targetY - modelPosRef.current.y) * 0.08
      } else {
        modelPosRef.current.x += (0.5 - modelPosRef.current.x) * 0.03
        modelPosRef.current.y += (0.5 - modelPosRef.current.y) * 0.03
      }

      rotationRef.current.x += (globalMousePos.y * 2 - rotationRef.current.x) * 0.05
      rotationRef.current.y += (globalMousePos.x * 2 - rotationRef.current.y) * 0.05

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const transformedVertices = sphereVertices.map((vertex) => {
        let point = [...vertex]
        point = rotateX(point, rotationRef.current.x)
        point = rotateY(point, rotationRef.current.y)
        point = rotateZ(point, Date.now() * 0.0005)
        point[2] += 3
        return point
      })

      const centerX = canvas.width / 2 + (modelPosRef.current.x - 0.5) * canvas.width * 0.4
      const centerY = canvas.height / 2 + (modelPosRef.current.y - 0.5) * canvas.height * 0.4

      transformedVertices.forEach((vertex) => {
        const p = project(vertex)
        const depth = (vertex[2] - 2) / 4.5
        const size = 3 + depth * 4

        const selectedColor = colorMap[modelColor] || colorMap.red
        ctx.fillStyle = selectedColor
        ctx.shadowColor = selectedColor
        ctx.shadowBlur = 15

        ctx.beginPath()
        ctx.arc(p[0] + centerX, p[1] + centerY, size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.shadowColor = "transparent"
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isFollowing, modelColor, globalMousePos])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-30 ${
        isFollowing ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    />
  )
}
