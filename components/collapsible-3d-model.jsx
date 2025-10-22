"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export default function Collapsible3DModel() {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)
  const meshRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [selectedColor, setSelectedColor] = useState("white")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [followPosition, setFollowPosition] = useState({ x: 0, y: 0 })

  const colors = {
    white: 0xffffff,
    gray: 0x808080,
    darkGray: 0x404040,
    lightGray: 0xc0c0c0,
    black: 0x000000,
    silver: 0xc0c0c0,
    charcoal: 0x36454f,
    platinum: 0xe5e4e2
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

    // Create a beautiful complex 3D model
    const group = new THREE.Group()
    
    // Main central sphere with gradient material
    const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32)
    const sphereMaterial = new THREE.MeshPhongMaterial({ 
      color: colors[selectedColor],
      shininess: 150,
      transparent: true,
      opacity: 0.9
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    group.add(sphere)

    // Inner rotating rings
    for (let i = 0; i < 4; i++) {
      const ringGeometry = new THREE.TorusGeometry(1.8 + i * 0.2, 0.08, 8, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: colors[selectedColor],
        transparent: true,
        opacity: 0.7 - i * 0.1
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.rotation.x = Math.PI / 2 + i * 0.3
      ring.rotation.y = i * Math.PI / 4
      ring.userData = { 
        speed: 0.008 + i * 0.003, 
        direction: i % 2 === 0 ? 1 : -1,
        axis: i % 3
      }
      group.add(ring)
    }

    // Orbiting satellites
    for (let i = 0; i < 8; i++) {
      const satelliteGeometry = new THREE.OctahedronGeometry(0.15, 0)
      const satelliteMaterial = new THREE.MeshPhongMaterial({ 
        color: colors[selectedColor],
        shininess: 100
      })
      const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial)
      
      const radius = 2.8
      const angle = (i / 8) * Math.PI * 2
      satellite.position.x = Math.cos(angle) * radius
      satellite.position.y = Math.sin(angle) * radius
      satellite.position.z = Math.sin(angle * 2) * 0.5
      
      satellite.userData = {
        originalX: satellite.position.x,
        originalY: satellite.position.y,
        originalZ: satellite.position.z,
        speed: 0.015 + i * 0.002,
        radius: radius,
        angle: angle
      }
      
      group.add(satellite)
    }

    // Add enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(colors[selectedColor], 0.6, 15)
    pointLight.position.set(0, 0, 4)
    scene.add(pointLight)

    const spotLight = new THREE.SpotLight(colors[selectedColor], 0.3, 20, Math.PI / 6)
    spotLight.position.set(0, 0, 8)
    scene.add(spotLight)

    scene.add(group)
    meshRef.current = group

    // Mouse tracking
    const handleMouseMove = (event) => {
      mouseRef.current.x = ((event.clientX / window.innerWidth) * 2 - 1) * 10
      mouseRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1) * 10
      
      // Update follow position for follow mode
      if (isFollowing) {
        setFollowPosition({
          x: event.clientX - 150, // Center the model
          y: event.clientY - 200
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      // Rotate main sphere
      sphere.rotation.x += 0.008
      sphere.rotation.y += 0.012

      // Rotate rings with different patterns
      group.children.forEach((child, index) => {
        if (child.geometry.type === 'TorusGeometry') {
          const userData = child.userData
          if (userData.axis === 0) {
            child.rotation.x += userData.speed * userData.direction
          } else if (userData.axis === 1) {
            child.rotation.y += userData.speed * userData.direction
          } else {
            child.rotation.z += userData.speed * userData.direction
          }
        }
      })

      // Animate satellites
      group.children.forEach((child, index) => {
        if (child.geometry.type === 'OctahedronGeometry') {
          const userData = child.userData
          const angle = time * userData.speed
          child.position.x = Math.cos(angle) * userData.radius
          child.position.y = Math.sin(angle) * userData.radius
          child.position.z = Math.sin(angle * 2) * 0.5
          
          // Mouse interaction for satellites
          if (isFollowing) {
            const mouseInfluence = 0.2
            child.position.x += mouseRef.current.x * mouseInfluence
            child.position.y += mouseRef.current.y * mouseInfluence
          }
        }
      })

      // Mouse interaction with main model
      if (isFollowing) {
        group.rotation.x += mouseRef.current.y * 0.05
        group.rotation.y += mouseRef.current.x * 0.05
      }

      // Update lights color
      pointLight.color.setHex(colors[selectedColor])
      spotLight.color.setHex(colors[selectedColor])

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [selectedColor, isFollowing])

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

  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
    if (!isFollowing) {
      // When starting to follow, close the popup
      setIsExpanded(false)
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      {/* Following model - follows mouse */}
      {isFollowing && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{
            left: followPosition.x,
            top: followPosition.y,
            width: '300px',
            height: '400px'
          }}
        >
          <div ref={mountRef} className="w-full h-full" />
        </div>
      )}

      {/* Collapsed state - bottom right corner */}
      {!isExpanded && !isFollowing && (
        <div className="fixed bottom-4 right-4 z-30">
          <button
            onClick={toggleExpanded}
            className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group border border-gray-500"
          >
            <div className="w-8 h-8 bg-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      )}

      {/* Expanded state - popup window */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">3D Model Viewer</h3>
              <button
                onClick={toggleExpanded}
                className="text-gray-400 hover:text-white transition-colors text-2xl hover:scale-110 transform"
              >
                ✕
              </button>
            </div>
            
            {/* 3D Model Canvas */}
            <div ref={mountRef} className="rounded-lg overflow-hidden mb-4 bg-gray-800/50" />
            
            {/* Controls */}
            <div className="space-y-4">
              {/* Follow Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Follow Mouse:</span>
                <button
                  onClick={toggleFollow}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isFollowing 
                      ? 'bg-white hover:bg-gray-200 text-black' 
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Not Following'}
                </button>
              </div>
              
              {/* Color Options */}
              <div>
                <p className="text-gray-300 text-sm mb-2">Change Color:</p>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(colors).map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
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
              
              {/* Info */}
              <div className="text-center">
                <p className="text-gray-400 text-xs">
                  {isFollowing ? 'Move mouse to interact with the model' : 'Model is fixed in position'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
