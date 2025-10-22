"use client"

import { useState, useEffect, useRef } from "react"

export default function Interactive3DModels() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [selectedColor, setSelectedColor] = useState("#ef4444")
  const [isFollowing, setIsFollowing] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const modelsRef = useRef([])

  const colors = [
    { name: "Red", value: "#ef4444" },
    { name: "Yellow", value: "#eab308" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#22c55e" },
    { name: "White", value: "#ffffff" },
  ]

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
      mouseRef.current.x = event.clientX - rect.left
      mouseRef.current.y = event.clientY - rect.top
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", resizeCanvas)

    // Create 3D box model
    const createBox = (size) => {
      return [
        // Front face
        [-size, -size, size],
        [size, -size, size],
        [size, size, size],
        [-size, size, size],
        // Back face
        [-size, -size, -size],
        [size, -size, -size],
        [size, size, -size],
        [-size, size, -size],
      ]
    }

    // Initialize models
    modelsRef.current = [
      {
        vertices: createBox(1.5),
        position: { x: 150, y: 150, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        targetRotation: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0 },
      },
      {
        vertices: createBox(1.2),
        position: { x: 400, y: 200, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        targetRotation: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0 },
      },
      {
        vertices: createBox(1),
        position: { x: 250, y: 350, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        targetRotation: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0 },
      },
    ]

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
    const project = (point, z) => {
      const scale = 200 / (8 + z)
      return [point[0] * scale, point[1] * scale]
    }

    // Check collision between models
    const checkCollision = (model1, model2, minDistance = 80) => {
      const dx = model1.position.x - model2.position.x
      const dy = model1.position.y - model2.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance < minDistance
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      modelsRef.current.forEach((model, modelIndex) => {
        // Update rotation
        model.rotation.x += (model.targetRotation.x - model.rotation.x) * 0.1
        model.rotation.y += (model.targetRotation.y - model.rotation.y) * 0.1
        model.rotation.z += (model.targetRotation.z - model.rotation.z) * 0.1

        // Auto-rotate
        model.rotation.x += 0.005
        model.rotation.y += 0.008

        // Handle following
        if (isFollowing && modelIndex === 0) {
          const targetX = mouseRef.current.x
          const targetY = mouseRef.current.y

          model.velocity.x += (targetX - model.position.x) * 0.02
          model.velocity.y += (targetY - model.position.y) * 0.02

          model.velocity.x *= 0.95
          model.velocity.y *= 0.95

          model.position.x += model.velocity.x
          model.position.y += model.velocity.y

          model.targetRotation.x = (mouseRef.current.y / canvas.offsetHeight) * Math.PI
          model.targetRotation.y = (mouseRef.current.x / canvas.offsetWidth) * Math.PI
        } else if (!isFollowing && modelIndex === 0) {
          // Return to original position
          model.position.x += (150 - model.position.x) * 0.05
          model.position.y += (150 - model.position.y) * 0.05
          model.velocity.x *= 0.9
          model.velocity.y *= 0.9
        }

        // Collision avoidance
        modelsRef.current.forEach((otherModel, otherIndex) => {
          if (modelIndex !== otherIndex && checkCollision(model, otherModel)) {
            const dx = model.position.x - otherModel.position.x
            const dy = model.position.y - otherModel.position.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const angle = Math.atan2(dy, dx)

            const pushForce = 0.5
            model.velocity.x += Math.cos(angle) * pushForce
            model.velocity.y += Math.sin(angle) * pushForce
          }
        })

        // Transform and draw vertices
        const transformedVertices = model.vertices.map((vertex) => {
          let point = [...vertex]
          point = rotateX(point, model.rotation.x)
          point = rotateY(point, model.rotation.y)
          point = rotateZ(point, model.rotation.z)
          return point
        })

        // Draw edges
        const edges = [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 0],
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 4],
          [0, 4],
          [1, 5],
          [2, 6],
          [3, 7],
        ]

        ctx.strokeStyle = selectedColor
        ctx.lineWidth = 2
        ctx.shadowColor = selectedColor
        ctx.shadowBlur = 10

        edges.forEach(([start, end]) => {
          const p1 = project(transformedVertices[start], transformedVertices[start][2])
          const p2 = project(transformedVertices[end], transformedVertices[end][2])

          ctx.beginPath()
          ctx.moveTo(p1[0] + model.position.x, p1[1] + model.position.y)
          ctx.lineTo(p2[0] + model.position.x, p2[1] + model.position.y)
          ctx.stroke()
        })

        // Draw vertices
        ctx.fillStyle = selectedColor
        transformedVertices.forEach((vertex) => {
          const p = project(vertex, vertex[2])
          ctx.beginPath()
          ctx.arc(p[0] + model.position.x, p[1] + model.position.y, 3, 0, Math.PI * 2)
          ctx.fill()
        })
      })

      ctx.shadowColor = "transparent"
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [selectedColor, isFollowing])

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full bg-black rounded-lg" />

      {/* Control Panel - Bottom Right */}
      <div className="absolute bottom-6 right-6 bg-black/80 border-2 border-red-600 rounded-lg p-4 backdrop-blur-sm">
        {/* Color Selector */}
        <div className="mb-4">
          <p className="text-white text-sm font-semibold mb-2">Color</p>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-6 h-6 rounded border-2 transition-all ${
                  selectedColor === color.value ? "border-white scale-110" : "border-gray-600"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Follow Options */}
        <div className="space-y-2">
          <button
            onClick={() => setIsFollowing(true)}
            className={`w-full px-3 py-2 rounded text-sm font-semibold transition-all ${
              isFollowing ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setIsFollowing(false)}
            className={`w-full px-3 py-2 rounded text-sm font-semibold transition-all ${
              !isFollowing ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Not Following
          </button>
        </div>
      </div>

      {/* Popup Box - Right Side */}
      <button
        onClick={() => setShowPopup(true)}
        className="absolute right-6 top-6 w-12 h-12 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-all hover:scale-110 shadow-lg shadow-red-600/50"
      >
        i
      </button>

      {/* Popup Window */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-black border-2 border-red-600 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl shadow-red-600/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Interactive Models</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="text-gray-300 space-y-3">
              <p>
                <span className="text-red-400 font-semibold">Interactive 3D Models:</span> Watch the models move and
                rotate on the canvas.
              </p>
              <p>
                <span className="text-red-400 font-semibold">Color Selector:</span> Change the color of all models using
                the color palette.
              </p>
              <p>
                <span className="text-red-400 font-semibold">Following Mode:</span> Click "Following" to make the first
                model follow your mouse with smooth animation.
              </p>
              <p>
                <span className="text-red-400 font-semibold">Collision Detection:</span> Models avoid colliding with
                each other.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
