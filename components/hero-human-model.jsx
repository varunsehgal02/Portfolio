"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function HeroHumanModel() {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)
  const meshRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!mountRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(400, 400)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Mouse tracking
    const mouse = new THREE.Vector2()
    const mouseTarget = new THREE.Vector2()
    let mouseX = 0, mouseY = 0

    const handleMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect()
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1
      mouseTarget.set(mouseX * 4, mouseY * 4, 0)
      mouseRef.current = { x: mouseX, y: mouseY }
    }

    // Create a single interactive model
    const group = new THREE.Group()

    // Central core - Icosahedron
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 2)
    const coreMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00ff88,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
      shininess: 100
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    group.add(core)

    // Orbiting rings
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(2 + i * 0.5, 0.1, 8, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(0.1 + i * 0.2, 0.8, 0.6),
        transparent: true,
        opacity: 0.6 - i * 0.1
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.rotation.x = Math.PI / 2 + i * 0.5
      ring.rotation.y = i * Math.PI / 4
      group.add(ring)
    }

    // Orbiting satellites
    for (let i = 0; i < 8; i++) {
      const satelliteGeometry = new THREE.OctahedronGeometry(0.3)
      const satelliteMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color().setHSL(i / 8, 0.8, 0.7),
        shininess: 50,
        transparent: true,
        opacity: 0.9
      })
      const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial)
      
      const angle = (i / 8) * Math.PI * 2
      const radius = 3
      satellite.position.x = Math.cos(angle) * radius
      satellite.position.y = Math.sin(angle) * radius
      satellite.position.z = Math.sin(angle * 2) * 0.5
      
      satellite.userData = {
        originalX: satellite.position.x,
        originalY: satellite.position.y,
        originalZ: satellite.position.z,
        speed: 0.01 + i * 0.005,
        radius: radius,
        angle: angle
      }
      
      group.add(satellite)
    }

    // Energy particles
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 50
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const radius = 4 + Math.random() * 2
      particlePositions[i * 3] = Math.cos(angle) * radius
      particlePositions[i * 3 + 1] = Math.sin(angle) * radius
      particlePositions[i * 3 + 2] = Math.sin(angle * 3) * 1
      
      const hue = (i / particleCount) * 0.8
      particleColors[i * 3] = hue
      particleColors[i * 3 + 1] = 0.8
      particleColors[i * 3 + 2] = 1
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })
    
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    group.add(particles)

    // Add "Hi" text using simple geometry instead of TextGeometry
    const textGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.1)
    const textMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffaa00,
      shininess: 100
    })
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    textMesh.position.set(0, 3, 0)
    textMesh.rotation.x = -Math.PI / 6
    group.add(textMesh)

    scene.add(group)

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x00ff88, 0.6, 15)
    pointLight.position.set(0, 0, 5)
    scene.add(pointLight)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      // Enhanced mouse-controlled rotation and movement
      group.rotation.y = mouseX * 0.4
      group.rotation.x = mouseY * 0.3
      
      // Mouse-controlled position
      group.position.x = mouseX * 0.5
      group.position.y = mouseY * 0.3

      // Gentle floating motion
      group.position.z = Math.sin(time) * 0.3

      // Rotate core with mouse influence
      core.rotation.x += 0.005 + mouseY * 0.01
      core.rotation.y += 0.008 + mouseX * 0.01

      // Rotate rings with different patterns and mouse influence
      group.children.forEach((child, index) => {
        if (child.geometry.type === 'TorusGeometry') {
          child.rotation.y += 0.01 + index * 0.005 + mouseX * 0.005
          child.rotation.x += mouseY * 0.003
        }
      })

      // Animate satellites with enhanced mouse interaction
      group.children.forEach((child) => {
        if (child.userData && child.userData.speed) {
          child.userData.angle += child.userData.speed + mouseX * 0.002
          child.position.x = Math.cos(child.userData.angle) * child.userData.radius
          child.position.y = Math.sin(child.userData.angle) * child.userData.radius
          child.position.z = Math.sin(child.userData.angle * 2) * 0.5
          
          child.rotation.x += 0.01 + mouseY * 0.01
          child.rotation.y += 0.015 + mouseX * 0.01
          child.rotation.z += child.userData.speed * 0.5
        }
      })

      // Rotate particles
      if (particles) {
        particles.rotation.y += 0.008
        particles.rotation.x += 0.003
      }

      // Pulsing glow effect
      const glowIntensity = 0.6 + Math.sin(time * 1.5) * 0.3
      pointLight.intensity = glowIntensity

      renderer.render(scene, camera)
    }

    // Add mouse event listener
    mountRef.current.addEventListener('mousemove', handleMouseMove)

    // Start animation
    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={mountRef} className="w-full h-full bg-gray-800/20 rounded-lg border border-gray-600/30" />
  )
}