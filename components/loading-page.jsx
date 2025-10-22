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

    // Create floating geometric shapes
    const geometries = [
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.ConeGeometry(0.3, 0.8, 8),
      new THREE.TorusGeometry(0.3, 0.1, 8, 16),
      new THREE.OctahedronGeometry(0.4),
    ]

    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff4444, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x44ff44, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0x4444ff, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0xffff44, wireframe: true }),
      new THREE.MeshBasicMaterial({ color: 0xff44ff, wireframe: true }),
    ]

    const meshes = []
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)]
      const material = materials[Math.floor(Math.random() * materials.length)]
      const mesh = new THREE.Mesh(geometry, material)
      
      mesh.position.x = (Math.random() - 0.5) * 20
      mesh.position.y = (Math.random() - 0.5) * 20
      mesh.position.z = (Math.random() - 0.5) * 10
      
      mesh.rotation.x = Math.random() * Math.PI
      mesh.rotation.y = Math.random() * Math.PI
      
      scene.add(mesh)
      meshes.push(mesh)
    }

    // Create particle system
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 200
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff4444,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
    })

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      // Rotate meshes
      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.01 * (index % 3 + 1)
        mesh.rotation.y += 0.01 * (index % 2 + 1)
        mesh.position.y += Math.sin(time + index) * 0.01
      })

      // Rotate particle system
      particleSystem.rotation.y += 0.002

      // Update particle positions
      const positions = particleGeometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(time + i) * 0.01
        if (positions[i3 + 1] > 25) positions[i3 + 1] = -25
      }
      particleGeometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
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
