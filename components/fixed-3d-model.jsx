"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export default function Fixed3DModel() {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)
  const meshRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [selectedColor, setSelectedColor] = useState("red")

  const colors = {
    red: 0xff4444,
    blue: 0x4488ff,
    green: 0x44ff44,
    purple: 0xff44ff,
    orange: 0xffaa00,
    cyan: 0x00ffff,
    yellow: 0xffff44,
    pink: 0xff69b4
  }

  useEffect(() => {
    if (!mountRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, 300 / 400, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(300, 400)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Create a complex 3D model
    const group = new THREE.Group()
    
    // Main sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
    const sphereMaterial = new THREE.MeshPhongMaterial({ 
      color: colors[selectedColor],
      shininess: 100,
      transparent: true,
      opacity: 0.9
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    group.add(sphere)

    // Orbiting rings
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(1.5 + i * 0.3, 0.05, 8, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: colors[selectedColor],
        transparent: true,
        opacity: 0.6 - i * 0.1
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.rotation.x = Math.PI / 2
      ring.userData = { speed: 0.01 + i * 0.005, direction: i % 2 === 0 ? 1 : -1 }
      group.add(ring)
    }

    // Floating particles around the model
    for (let i = 0; i < 20; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8)
      const particleMaterial = new THREE.MeshBasicMaterial({ 
        color: colors[selectedColor],
        transparent: true,
        opacity: 0.7
      })
      const particle = new THREE.Mesh(particleGeometry, particleMaterial)
      
      const radius = 2.5 + Math.random() * 1
      const angle = (i / 20) * Math.PI * 2
      particle.position.x = Math.cos(angle) * radius
      particle.position.y = Math.sin(angle) * radius
      particle.position.z = (Math.random() - 0.5) * 2
      
      particle.userData = {
        originalX: particle.position.x,
        originalY: particle.position.y,
        originalZ: particle.position.z,
        speed: 0.02 + Math.random() * 0.01,
        radius: radius
      }
      
      group.add(particle)
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(colors[selectedColor], 0.5, 10)
    pointLight.position.set(0, 0, 3)
    scene.add(pointLight)

    scene.add(group)
    meshRef.current = group

    // Mouse tracking
    const handleMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    mountRef.current.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      // Rotate main sphere
      sphere.rotation.x += 0.01
      sphere.rotation.y += 0.015

      // Rotate rings
      group.children.forEach((child, index) => {
        if (child.geometry.type === 'TorusGeometry') {
          child.rotation.y += child.userData.speed * child.userData.direction
          child.rotation.z += child.userData.speed * 0.5
        }
      })

      // Animate particles
      group.children.forEach((child, index) => {
        if (child.geometry.type === 'SphereGeometry' && child.geometry.parameters.radius === 0.05) {
          const angle = time * child.userData.speed
          child.position.x = Math.cos(angle) * child.userData.radius
          child.position.y = Math.sin(angle) * child.userData.radius
          child.position.z += Math.sin(time + index) * 0.01
          
          // Mouse interaction for particles
          const mouseInfluence = 0.3
          child.position.x += mouseRef.current.x * mouseInfluence
          child.position.y += mouseRef.current.y * mouseInfluence
        }
      })

      // Mouse interaction with main model
      group.rotation.x += mouseRef.current.y * 0.1
      group.rotation.y += mouseRef.current.x * 0.1

      // Update point light color
      pointLight.color.setHex(colors[selectedColor])

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', handleMouseMove)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [selectedColor])

  const handleColorChange = (color) => {
    setSelectedColor(color)
    
    // Update materials
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material.color.setHex(colors[color])
        }
      })
    }
  }

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20">
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-red-600/30">
        <h3 className="text-white text-sm font-semibold mb-3 text-center">3D Model</h3>
        
        {/* 3D Model Canvas */}
        <div ref={mountRef} className="rounded-lg overflow-hidden mb-4" />
        
        {/* Color Options */}
        <div className="space-y-2">
          <p className="text-gray-300 text-xs text-center">Change Color:</p>
          <div className="grid grid-cols-4 gap-2">
            {Object.keys(colors).map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                  selectedColor === color 
                    ? 'border-white shadow-lg shadow-white/50' 
                    : 'border-gray-600 hover:border-gray-400'
                }`}
                style={{ backgroundColor: `#${colors[color].toString(16).padStart(6, '0')}` }}
                title={color}
              />
            ))}
          </div>
        </div>
        
        {/* Interactive Info */}
        <div className="mt-3 text-center">
          <p className="text-gray-400 text-xs">Move mouse to interact</p>
        </div>
      </div>
    </div>
  )
}
