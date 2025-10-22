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
    camera.position.z = 15

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

    // Create 4 distinct interactive models
    const meshes = []
    
    // Model 1: Central Icosahedron with rings
    const coreGeometry = new THREE.IcosahedronGeometry(1.0, 1)
    const coreMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00ff88,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
      shininess: 100
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    core.position.set(-4, 0, 0)
    core.userData = {
      originalX: -4,
      originalY: 0,
      originalZ: 0,
      speed: 0.01,
      hoverIntensity: 1.5,
      pulsePhase: 0,
      scale: 1.2,
      followMouse: true,
      mouseInfluence: 0.8,
      type: 'core'
    }
    scene.add(core)
    meshes.push(core)

    // Add rings around core
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(1.5 + i * 0.3, 0.1, 8, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(0.3 + i * 0.2, 0.8, 0.6),
        transparent: true,
        opacity: 0.6 - i * 0.15
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.position.set(-4, 0, 0)
      ring.rotation.x = Math.PI / 2 + i * 0.5
      ring.rotation.y = i * Math.PI / 3
      ring.userData = {
        originalX: -4,
        originalY: 0,
        originalZ: 0,
        speed: 0.005 + i * 0.002,
        hoverIntensity: 1.0,
        pulsePhase: i * Math.PI / 2,
        scale: 1.0,
        followMouse: true,
        mouseInfluence: 0.6,
        type: 'ring',
        parent: core
      }
      scene.add(ring)
      meshes.push(ring)
    }

    // Model 2: Orbiting satellites
    const satelliteGroup = new THREE.Group()
    satelliteGroup.position.set(4, 0, 0)
    
    for (let i = 0; i < 6; i++) {
      const satelliteGeometry = new THREE.OctahedronGeometry(0.3)
      const satelliteMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color().setHSL(i / 6, 0.8, 0.7),
        shininess: 50,
        transparent: true,
        opacity: 0.9
      })
      const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial)
      
      const angle = (i / 6) * Math.PI * 2
      const radius = 2
      satellite.position.x = Math.cos(angle) * radius
      satellite.position.y = Math.sin(angle) * radius
      satellite.position.z = Math.sin(angle * 2) * 0.5
      
      satellite.userData = {
        originalX: satellite.position.x,
        originalY: satellite.position.y,
        originalZ: satellite.position.z,
        speed: 0.01 + i * 0.003,
        radius: radius,
        angle: angle,
        type: 'satellite'
      }
      
      satelliteGroup.add(satellite)
    }
    
    satelliteGroup.userData = {
      originalX: 4,
      originalY: 0,
      originalZ: 0,
      speed: 0.008,
      hoverIntensity: 1.2,
      pulsePhase: Math.PI,
      scale: 1.0,
      followMouse: true,
      mouseInfluence: 0.7,
      type: 'group'
    }
    scene.add(satelliteGroup)
    meshes.push(satelliteGroup)

    // Model 3: Spiral structure
    const spiralGroup = new THREE.Group()
    spiralGroup.position.set(0, -3, 0)
    
    for (let i = 0; i < 8; i++) {
      const spiralGeometry = new THREE.ConeGeometry(0.2, 0.8, 6)
      const spiralMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color().setHSL(0.1 + i * 0.1, 0.9, 0.6),
        shininess: 80
      })
      const spiral = new THREE.Mesh(spiralGeometry, spiralMaterial)
      
      const angle = (i / 8) * Math.PI * 4
      const radius = 1.5
      spiral.position.x = Math.cos(angle) * radius
      spiral.position.y = Math.sin(angle) * radius * 0.3
      spiral.position.z = i * 0.2
      spiral.rotation.z = angle
      
      spiralGroup.add(spiral)
    }
    
    spiralGroup.userData = {
      originalX: 0,
      originalY: -3,
      originalZ: 0,
      speed: 0.012,
      hoverIntensity: 1.3,
      pulsePhase: Math.PI * 1.5,
      scale: 1.1,
      followMouse: true,
      mouseInfluence: 0.9,
      type: 'spiral'
    }
    scene.add(spiralGroup)
    meshes.push(spiralGroup)

    // Model 4: Floating crystals
    const crystalGroup = new THREE.Group()
    crystalGroup.position.set(0, 3, 0)
    
    for (let i = 0; i < 5; i++) {
      const crystalGeometry = new THREE.TetrahedronGeometry(0.4)
      const crystalMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color().setHSL(0.6 + i * 0.08, 0.8, 0.7),
        shininess: 100,
        transparent: true,
        opacity: 0.8
      })
      const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial)
      
      const angle = (i / 5) * Math.PI * 2
      const radius = 1.8
      crystal.position.x = Math.cos(angle) * radius
      crystal.position.y = Math.sin(angle) * radius * 0.5
      crystal.position.z = Math.sin(angle * 3) * 0.3
      
      crystal.userData = {
        originalX: crystal.position.x,
        originalY: crystal.position.y,
        originalZ: crystal.position.z,
        speed: 0.008 + i * 0.002,
        radius: radius,
        angle: angle,
        type: 'crystal'
      }
      
      crystalGroup.add(crystal)
    }
    
    crystalGroup.userData = {
      originalX: 0,
      originalY: 3,
      originalZ: 0,
      speed: 0.01,
      hoverIntensity: 1.4,
      pulsePhase: Math.PI * 2,
      scale: 1.0,
      followMouse: true,
      mouseInfluence: 0.8,
      type: 'crystal-group'
    }
    scene.add(crystalGroup)
    meshes.push(crystalGroup)

    // Create enhanced particle system for background
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 300
    const particlePositions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      particlePositions[i3] = (Math.random() - 0.5) * 100
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 100
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 50
      
      // Enhanced color palette
      const colorChoice = Math.random()
      if (colorChoice < 0.25) {
        colors[i3] = 1.0; colors[i3 + 1] = 0.27; colors[i3 + 2] = 0.27 // Red
      } else if (colorChoice < 0.5) {
        colors[i3] = 0.0; colors[i3 + 1] = 0.53; colors[i3 + 2] = 1.0 // Blue
      } else if (colorChoice < 0.75) {
        colors[i3] = 0.0; colors[i3 + 1] = 1.0; colors[i3 + 2] = 0.53 // Green
      } else {
        colors[i3] = 1.0; colors[i3 + 1] = 0.8; colors[i3 + 2] = 0.0 // Yellow
      }
      
      sizes[i] = Math.random() * 0.3 + 0.1
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.3,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)

    // Create mouse trail particles
    const trailGeometry = new THREE.BufferGeometry()
    const trailCount = 100
    const trailPositions = new Float32Array(trailCount * 3)
    const trailColors = new Float32Array(trailCount * 3)

    for (let i = 0; i < trailCount; i++) {
      const i3 = i * 3
      trailPositions[i3] = 0
      trailPositions[i3 + 1] = 0
      trailPositions[i3 + 2] = 0
      
      trailColors[i3] = 1.0
      trailColors[i3 + 1] = 0.5
      trailColors[i3 + 2] = 0.0
    }

    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3))

    const trailMaterial = new THREE.PointsMaterial({
      size: 0.2,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })

    const trailSystem = new THREE.Points(trailGeometry, trailMaterial)
    scene.add(trailSystem)

    // Add proper lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x00ff88, 0.5, 20)
    pointLight.position.set(0, 0, 10)
    scene.add(pointLight)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      // Advanced mouse interaction with perfect collision prevention
      meshes.forEach((mesh, index) => {
        if (!mesh.userData.followMouse) return
        
        const distance = Math.sqrt(
          Math.pow(mesh.position.x - mouseTarget.x, 2) + 
          Math.pow(mesh.position.y - mouseTarget.y, 2)
        )
        
        // Mouse attraction with smooth following
        if (distance < 25) {
          const force = (25 - distance) / 25
          const attractionForce = force * mesh.userData.hoverIntensity * mesh.userData.mouseInfluence
          
          // Calculate target position
          const targetX = mouseTarget.x + (mesh.userData.originalX - mouseTarget.x) * 0.3
          const targetY = mouseTarget.y + (mesh.userData.originalY - mouseTarget.y) * 0.3
          
          // Smooth movement towards target
          mesh.position.x += (targetX - mesh.position.x) * attractionForce * 0.08
          mesh.position.y += (targetY - mesh.position.y) * attractionForce * 0.08
          
          // Advanced collision detection with all other meshes
          meshes.forEach((otherMesh, otherIndex) => {
            if (index !== otherIndex && otherMesh.userData.followMouse) {
              const meshDistance = Math.sqrt(
                Math.pow(mesh.position.x - otherMesh.position.x, 2) + 
                Math.pow(mesh.position.y - otherMesh.position.y, 2)
              )
              
              // Dynamic minimum distance based on model type
              const minDistance = mesh.userData.type === 'group' ? 4.0 : 3.5
              
              if (meshDistance < minDistance) {
                const pushForce = (minDistance - meshDistance) / minDistance
                const dx = mesh.position.x - otherMesh.position.x
                const dy = mesh.position.y - otherMesh.position.y
                const angle = Math.atan2(dy, dx)
                
                // Strong push force to prevent touching
                const pushStrength = pushForce * 0.3
                mesh.position.x += Math.cos(angle) * pushStrength
                mesh.position.y += Math.sin(angle) * pushStrength
                otherMesh.position.x -= Math.cos(angle) * pushStrength * 0.5
                otherMesh.position.y -= Math.sin(angle) * pushStrength * 0.5
              }
            }
          })
          
          // Enhanced scaling with type-specific effects
          let scaleMultiplier = 1 + force * 1.5
          if (mesh.userData.type === 'core') scaleMultiplier += 0.5
          if (mesh.userData.type === 'group') scaleMultiplier += 0.3
          
          const pulseScale = scaleMultiplier + Math.sin(time * 2 + mesh.userData.pulsePhase) * 0.2
          mesh.scale.setScalar(mesh.userData.scale * pulseScale)
          
          // Enhanced rotation with type-specific patterns
          const rotationMultiplier = 1 + force * 2
          mesh.rotation.x += mesh.userData.speed * rotationMultiplier
          mesh.rotation.y += mesh.userData.speed * 0.8 * rotationMultiplier
          mesh.rotation.z += mesh.userData.speed * 0.4 * force
          
          // Enhanced material effects
          if (mesh.material && mesh.material.opacity !== undefined) {
            mesh.material.opacity = Math.min(1.0, 0.7 + force * 0.4)
          }
          
          // Special effects for different model types
          if (mesh.userData.type === 'core') {
            // Core pulses with energy
            const energyPulse = Math.sin(time * 4) * 0.1
            mesh.scale.setScalar(mesh.userData.scale * (1 + force * 1.5 + energyPulse))
          }
          
        } else {
          // Smooth return to original position
          const returnSpeed = 0.02
          mesh.position.x += (mesh.userData.originalX - mesh.position.x) * returnSpeed
          mesh.position.y += (mesh.userData.originalY - mesh.position.y) * returnSpeed
          mesh.scale.setScalar(mesh.userData.scale)
          
          if (mesh.material && mesh.material.opacity !== undefined) {
            mesh.material.opacity = 0.7
          }
          
          // Normal rotation
          mesh.rotation.x += mesh.userData.speed
          mesh.rotation.y += mesh.userData.speed * 0.8
        }

        // Enhanced floating motion with type-specific patterns
        const floatIntensity = mesh.userData.type === 'crystal-group' ? 0.02 : 0.01
        mesh.position.z += Math.sin(time + index * 0.5) * floatIntensity
        mesh.position.z += Math.cos(time * 0.8 + index * 0.3) * floatIntensity * 0.5
        
        // Animate child elements for groups
        if (mesh.userData.type === 'group' || mesh.userData.type === 'spiral' || mesh.userData.type === 'crystal-group') {
          mesh.children.forEach((child, childIndex) => {
            if (child.userData && child.userData.speed) {
              child.userData.angle += child.userData.speed
              child.position.x = Math.cos(child.userData.angle) * child.userData.radius
              child.position.y = Math.sin(child.userData.angle) * child.userData.radius
              if (child.userData.type === 'satellite') {
                child.position.z = Math.sin(child.userData.angle * 2) * 0.5
              }
              child.rotation.x += child.userData.speed * 2
              child.rotation.y += child.userData.speed * 1.5
            }
          })
        }
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
          const attractionForce = force * 0.02
          
          particlePositions[i3] += (mouseTarget.x - particlePositions[i3]) * attractionForce
          particlePositions[i3 + 1] += (mouseTarget.y - particlePositions[i3 + 1]) * attractionForce
          
          // Enhanced color intensity
          particleColors[i3] = Math.min(1.0, particleColors[i3] + force * 0.3)
          particleColors[i3 + 1] = Math.min(1.0, particleColors[i3 + 1] + force * 0.2)
          particleColors[i3 + 2] = Math.min(1.0, particleColors[i3 + 2] + force * 0.1)
        } else {
          // Smooth return to original position
          particlePositions[i3] += (particlePositions[i3] * 0.95 - particlePositions[i3]) * 0.01
          particlePositions[i3 + 1] += (particlePositions[i3 + 1] * 0.95 - particlePositions[i3 + 1]) * 0.01
        }
        
        // Enhanced floating motion
        particlePositions[i3] += Math.sin(time + i * 0.1) * 0.05
        particlePositions[i3 + 1] += Math.cos(time * 0.8 + i * 0.15) * 0.03
        particlePositions[i3 + 2] += Math.sin(time * 1.2 + i * 0.2) * 0.02
      }
      
      particleGeometry.attributes.position.needsUpdate = true
      particleGeometry.attributes.color.needsUpdate = true

      // Update mouse trail
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
    
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            onComplete()
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
          {displayText}
        </h1>
        
        <p className="text-xl md:text-2xl text-white mb-8 animate-fade-in-up">
          Let's explore my work
        </p>
        
        {!isLoading ? (
          <button
            onClick={handleEnter}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 animate-bounce"
          >
            Enter Portfolio
          </button>
        ) : (
          <div className="w-64 mx-auto">
            <div className="bg-gray-700 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-red-500 to-blue-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-white text-lg">
              Loading... {loadingProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-blue-900/20 animate-gradient-shift" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {typeof window !== 'undefined' && [...Array(50)].map((_, i) => {
          const left = Math.random() * 100
          const top = Math.random() * 100
          const delay = Math.random() * 5
          const duration = 3 + Math.random() * 4
          
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-500 rounded-full opacity-60 animate-float"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          )
        })}
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
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
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 8s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}