"use client"

import { useState, useEffect, useRef } from "react"
import * as THREE from "three"

export default function LoadingPage({ onComplete }) {
  const [displayText, setDisplayText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const welcomeText = "Welcome to my portfolio - Varun"
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
    if (!mountRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Mouse tracking
    const mouse = new THREE.Vector2()
    const mouseTarget = new THREE.Vector2()
    let mouseX = 0, mouseY = 0

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
      mouseTarget.set(mouseX * 10, mouseY * 10, 0)
    }

    // Create optimized floating geometric shapes with enhanced materials
    const geometries = [
      new THREE.BoxGeometry(0.6, 0.6, 0.6),
      new THREE.SphereGeometry(0.4, 12, 12),
      new THREE.ConeGeometry(0.4, 1.0, 6),
      new THREE.TorusGeometry(0.4, 0.15, 6, 12),
      new THREE.OctahedronGeometry(0.5),
      new THREE.TetrahedronGeometry(0.5),
    ]

    // Enhanced materials with better colors and effects
    const materials = [
      new THREE.MeshBasicMaterial({ 
        color: 0xff4444, 
        wireframe: true,
        transparent: true,
        opacity: 0.8
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0x00ff88, 
        wireframe: true,
        transparent: true,
        opacity: 0.8
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0x4488ff, 
        wireframe: true,
        transparent: true,
        opacity: 0.8
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0xffaa00, 
        wireframe: true,
        transparent: true,
        opacity: 0.8
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0xff44ff, 
        wireframe: true,
        transparent: true,
        opacity: 0.8
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0x00ffff, 
        wireframe: true,
        transparent: true,
        opacity: 0.8
      }),
    ]

    const meshes = []
    for (let i = 0; i < 12; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)]
      const material = materials[Math.floor(Math.random() * materials.length)]
      const mesh = new THREE.Mesh(geometry, material)
      
      mesh.position.x = (Math.random() - 0.5) * 25
      mesh.position.y = (Math.random() - 0.5) * 25
      mesh.position.z = (Math.random() - 0.5) * 15
      
      mesh.rotation.x = Math.random() * Math.PI
      mesh.rotation.y = Math.random() * Math.PI
      
      // Store original position and enhanced properties for mouse interaction
      mesh.userData = {
        originalX: mesh.position.x,
        originalY: mesh.position.y,
        originalZ: mesh.position.z,
        speed: Math.random() * 0.015 + 0.008,
        hoverIntensity: Math.random() * 0.5 + 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
        scale: Math.random() * 0.3 + 0.7
      }
      
      mesh.scale.setScalar(mesh.userData.scale)
      scene.add(mesh)
      meshes.push(mesh)
    }

    // Create optimized interactive particle system
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 80
      positions[i3 + 1] = (Math.random() - 0.5) * 80
      positions[i3 + 2] = (Math.random() - 0.5) * 40
      
      // Enhanced color palette
      const colorChoice = Math.random()
      if (colorChoice < 0.3) {
        colors[i3] = 1.0; colors[i3 + 1] = 0.27; colors[i3 + 2] = 0.27 // Red
      } else if (colorChoice < 0.6) {
        colors[i3] = 0.0; colors[i3 + 1] = 0.53; colors[i3 + 2] = 1.0 // Blue
      } else {
        colors[i3] = 0.0; colors[i3 + 1] = 1.0; colors[i3 + 2] = 0.53 // Green
      }
      
      sizes[i] = Math.random() * 0.2 + 0.1
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.2,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)

    // Create mouse trail particles
    const trailGeometry = new THREE.BufferGeometry()
    const trailCount = 50
    const trailPositions = new Float32Array(trailCount * 3)
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))

    const trailMaterial = new THREE.PointsMaterial({
      color: 0xff4444,
      size: 0.3,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })

    const trailSystem = new THREE.Points(trailGeometry, trailMaterial)
    scene.add(trailSystem)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      // Enhanced mouse interaction with meshes
      meshes.forEach((mesh, index) => {
        const distance = Math.sqrt(
          Math.pow(mesh.position.x - mouseTarget.x, 2) + 
          Math.pow(mesh.position.y - mouseTarget.y, 2)
        )
        
        // Enhanced hover effect with multiple zones
        if (distance < 12) {
          const force = (12 - distance) / 12
          const attractionForce = force * mesh.userData.hoverIntensity
          
          // Smooth attraction to mouse
          mesh.position.x += (mouseTarget.x - mesh.position.x) * attractionForce * 0.03
          mesh.position.y += (mouseTarget.y - mesh.position.y) * attractionForce * 0.03
          
          // Dynamic scaling with pulse effect
          const pulseScale = 1 + force * 0.8 + Math.sin(time * 2 + mesh.userData.pulsePhase) * 0.1
          mesh.scale.setScalar(mesh.userData.scale * pulseScale)
          
          // Enhanced rotation speed
          mesh.rotation.x += mesh.userData.speed * (1 + force * 2)
          mesh.rotation.y += mesh.userData.speed * 0.7 * (1 + force * 2)
          mesh.rotation.z += mesh.userData.speed * 0.3 * force
          
          // Color intensity based on distance
          mesh.material.opacity = 0.8 + force * 0.2
        } else {
          // Smooth return to original position
          mesh.position.x += (mesh.userData.originalX - mesh.position.x) * 0.008
          mesh.position.y += (mesh.userData.originalY - mesh.position.y) * 0.008
          mesh.scale.setScalar(mesh.userData.scale)
          mesh.material.opacity = 0.8
          
          // Normal rotation
          mesh.rotation.x += mesh.userData.speed
          mesh.rotation.y += mesh.userData.speed * 0.7
        }

        // Floating motion
        mesh.position.z += Math.sin(time + index) * 0.008
        mesh.position.z += Math.cos(time * 0.7 + index) * 0.003
      })

      // Enhanced mouse interaction with particles
      const particlePositions = particleGeometry.attributes.position.array
      const particleColors = particleGeometry.attributes.color.array
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const distance = Math.sqrt(
          Math.pow(particlePositions[i3] - mouseTarget.x, 2) + 
          Math.pow(particlePositions[i3 + 1] - mouseTarget.y, 2)
        )
        
        // Enhanced particle attraction with multiple zones
        if (distance < 20) {
          const force = (20 - distance) / 20
          const attractionForce = force * 0.015
          
          // Smooth attraction to mouse
          particlePositions[i3] += (mouseTarget.x - particlePositions[i3]) * attractionForce
          particlePositions[i3 + 1] += (mouseTarget.y - particlePositions[i3 + 1]) * attractionForce
          
          // Color intensity based on distance
          const intensity = 0.5 + force * 0.5
          particleColors[i3] *= intensity
          particleColors[i3 + 1] *= intensity
          particleColors[i3 + 2] *= intensity
        } else {
          // Reset color intensity
          const originalIntensity = 0.7
          particleColors[i3] = originalIntensity
          particleColors[i3 + 1] = originalIntensity
          particleColors[i3 + 2] = originalIntensity
        }
        
        // Enhanced floating motion
        particlePositions[i3 + 2] += Math.sin(time + i * 0.1) * 0.012
        particlePositions[i3 + 2] += Math.cos(time * 0.8 + i * 0.05) * 0.005
        
        // Boundary wrapping
        if (particlePositions[i3 + 2] > 20) particlePositions[i3 + 2] = -20
        if (particlePositions[i3 + 2] < -20) particlePositions[i3 + 2] = 20
      }
      
      particleGeometry.attributes.position.needsUpdate = true
      particleGeometry.attributes.color.needsUpdate = true

      // Update trail system
      const trailPositions = trailGeometry.attributes.position.array
      for (let i = trailCount - 1; i > 0; i--) {
        const i3 = i * 3
        const prevI3 = (i - 1) * 3
        trailPositions[i3] = trailPositions[prevI3]
        trailPositions[i3 + 1] = trailPositions[prevI3 + 1]
        trailPositions[i3 + 2] = trailPositions[prevI3 + 2]
      }
      
      // Add new trail point at mouse position
      trailPositions[0] = mouseTarget.x
      trailPositions[1] = mouseTarget.y
      trailPositions[2] = 0
      
      trailGeometry.attributes.position.needsUpdate = true

      // Rotate particle system
      particleSystem.rotation.y += 0.001

      renderer.render(scene, camera)
    }

    animate()

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove)
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  const handleEnter = () => {
    setIsLoading(true)
    
    // Simulate loading progress
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(progressInterval)
        setTimeout(() => {
          onComplete("Varun Sehgal")
        }, 500)
      }
      setLoadingProgress(progress)
    }, 100)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center z-50 overflow-hidden">
      {/* 3D Background */}
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-blue-900/20 animate-gradient-shift" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full opacity-60 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, 0.1) 25%, rgba(255, 0, 0, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.1) 75%, rgba(255, 0, 0, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 0, 0, 0.1) 25%, rgba(255, 0, 0, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.1) 75%, rgba(255, 0, 0, 0.1) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-4">
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-white h-16 flex items-center justify-center">
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400 animate-text-glow">
              {displayText}
              <span className="animate-pulse text-red-400">|</span>
            </span>
          </h1>

          <p className="text-gray-300 text-lg animate-fade-in-delay mt-10 drop-shadow-lg">
            Let's explore my work
          </p>

          {/* Loading Progress Bar */}
          {isLoading && (
            <div className="w-full bg-gray-700 rounded-full h-2 animate-fade-in">
              <div
                className="bg-gradient-to-r from-red-500 to-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          )}

          <button
            onClick={handleEnter}
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/25 disabled:shadow-none"
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

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(239, 68, 68, 0.5), 0 0 10px rgba(239, 68, 68, 0.3), 0 0 15px rgba(239, 68, 68, 0.2);
          }
          50% {
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.2);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1.5s ease-out;
        }

        .animate-gradient-shift {
          animation: gradient-shift 8s ease-in-out infinite;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
