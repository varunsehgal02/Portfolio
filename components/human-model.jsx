"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export default function HumanModel() {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)
  const meshRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!mountRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, 300 / 400, 0.1, 1000)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(300, 400)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Create a cool human-like abstract model
    const group = new THREE.Group()
    
    // Head (sphere)
    const headGeometry = new THREE.SphereGeometry(0.8, 16, 16)
    const headMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 1.5
    group.add(head)

    // Body (cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.8, 2, 12)
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4488ff,
      shininess: 80
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 0
    group.add(body)

    // Arms (cylinders)
    const armGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 8)
    const armMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x44ff44,
      shininess: 80
    })
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial)
    leftArm.position.set(-1.2, 0.5, 0)
    leftArm.rotation.z = 0.3
    group.add(leftArm)
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial)
    rightArm.position.set(1.2, 0.5, 0)
    rightArm.rotation.z = -0.3
    group.add(rightArm)

    // Legs (cylinders)
    const legGeometry = new THREE.CylinderGeometry(0.2, 0.25, 2, 8)
    const legMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff4444,
      shininess: 80
    })
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
    leftLeg.position.set(-0.4, -1.5, 0)
    group.add(leftLeg)
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
    rightLeg.position.set(0.4, -1.5, 0)
    group.add(rightLeg)

    // Eyes (small spheres)
    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8)
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    leftEye.position.set(-0.25, 1.7, 0.7)
    group.add(leftEye)
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    rightEye.position.set(0.25, 1.7, 0.7)
    group.add(rightEye)

    // Energy rings around the model
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(2 + i * 0.5, 0.1, 6, 16)
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffff44,
        transparent: true,
        opacity: 0.6 - i * 0.1
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.rotation.x = Math.PI / 2
      ring.userData = { 
        speed: 0.01 + i * 0.005,
        direction: i % 2 === 0 ? 1 : -1
      }
      group.add(ring)
    }

    // Floating particles around the model
    for (let i = 0; i < 20; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.05, 6, 6)
      const particleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff44ff,
        transparent: true,
        opacity: 0.8
      })
      const particle = new THREE.Mesh(particleGeometry, particleMaterial)
      
      const radius = 3 + Math.random() * 2
      const angle = (i / 20) * Math.PI * 2
      particle.position.x = Math.cos(angle) * radius
      particle.position.y = Math.sin(angle) * radius + Math.random() * 2 - 1
      particle.position.z = Math.sin(angle * 2) * 1
      
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

    const pointLight = new THREE.PointLight(0xffffff, 0.5, 20)
    pointLight.position.set(0, 0, 5)
    scene.add(pointLight)

    scene.add(group)
    meshRef.current = group

    // Mouse tracking
    const handleMouseMove = (event) => {
      mouseRef.current.x = ((event.clientX / window.innerWidth) * 2 - 1) * 5
      mouseRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1) * 5
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      // Rotate the entire model based on mouse movement
      group.rotation.y += mouseRef.current.x * 0.01
      group.rotation.x += mouseRef.current.y * 0.01

      // Gentle floating motion
      group.position.y = Math.sin(time * 0.5) * 0.2

      // Rotate energy rings
      group.children.forEach((child, index) => {
        if (child.geometry.type === 'TorusGeometry') {
          child.rotation.y += child.userData.speed * child.userData.direction
          child.rotation.z += child.userData.speed * 0.5
        }
      })

      // Animate floating particles
      group.children.forEach((child, index) => {
        if (child.geometry.type === 'SphereGeometry' && child.geometry.parameters.radius === 0.05) {
          const angle = time * child.userData.speed
          child.position.x = Math.cos(angle) * child.userData.radius
          child.position.y = Math.sin(angle) * child.userData.radius + Math.sin(time + index) * 0.5
          child.position.z = Math.sin(angle * 2) * 1
        }
      })

      // Rotate arms slightly
      leftArm.rotation.z = 0.3 + Math.sin(time) * 0.1
      rightArm.rotation.z = -0.3 + Math.sin(time + Math.PI) * 0.1

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
  }, [])

  return (
    <div className="fixed top-4 left-4 z-30">
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-600/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-semibold">Human Model</span>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="px-2 py-1 text-xs rounded transition-all duration-300 bg-gray-600 hover:bg-gray-700 text-white"
          >
            {isVisible ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {isVisible && (
          <div ref={mountRef} className="rounded-lg overflow-hidden" />
        )}
        
        <div className="mt-2 text-center">
          <p className="text-gray-400 text-xs">Move mouse to rotate</p>
        </div>
      </div>
    </div>
  )
}
