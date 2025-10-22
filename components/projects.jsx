"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import NetworkEffect from "./network-effect"

export default function Projects() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    // Create floating particles
    const createParticles = () => {
      const particles = []
      const particleCount = 18

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.1,
          color: Math.random() > 0.5 ? '#ef4444' : '#3b82f6',
          pulse: Math.random() * Math.PI * 2
        })
      }

      return particles
    }

    particlesRef.current = createParticles()

    window.addEventListener("resize", resizeCanvas)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.pulse += 0.015

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Draw particle with pulsing effect
        const pulseSize = particle.radius + Math.sin(particle.pulse) * 0.4
        ctx.save()
        ctx.shadowColor = particle.color
        ctx.shadowBlur = 8
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity + Math.sin(particle.pulse) * 0.15
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw connections
      ctx.strokeStyle = "rgba(239, 68, 68, 0.1)"
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 90) {
            ctx.globalAlpha = 1 - distance / 90
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])
  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-featured e-commerce platform built with React and Node.js, featuring product catalog, shopping cart, and payment integration.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
      link: "https://github.com/varunsehgal02",
      demo: "https://ecommerce-demo.vercel.app",
      image: "/ecommerce-platform-concept.png",
    },
    {
      title: "3D Portfolio Website",
      description:
        "Interactive portfolio website featuring 3D animations with Three.js and smooth scroll navigation. Showcasing frontend and design skills.",
      technologies: ["React", "Three.js", "Tailwind CSS", "Next.js"],
      link: "https://github.com/varunsehgal02",
      demo: "https://portfolio-3d.vercel.app",
      image: "/3d-portfolio.jpg",
    },
    {
      title: "Task Management App",
      description:
        "A collaborative task management application with real-time updates, user authentication, and team collaboration features.",
      technologies: ["React", "Firebase", "Tailwind CSS", "JavaScript"],
      link: "https://github.com/varunsehgal02",
      demo: "https://taskmanager-demo.vercel.app",
      image: "/task-management-concept.png",
    },
    {
      title: "Weather Dashboard",
      description:
        "Real-time weather dashboard with interactive maps, forecasts, and beautiful UI. Built with React and weather APIs.",
      technologies: ["React", "API Integration", "Chart.js", "Tailwind CSS"],
      link: "https://github.com/varunsehgal02",
      demo: "https://weather-dashboard-demo.vercel.app",
      image: "/weather-dashboard.png",
    },
    {
      title: "Social Media Analytics",
      description:
        "Analytics dashboard for social media metrics with data visualization, charts, and performance tracking.",
      technologies: ["React", "Chart.js", "Node.js", "MongoDB"],
      link: "https://github.com/varunsehgal02",
      demo: "https://analytics-dashboard-demo.vercel.app",
      image: "/analytics-dashboard.png",
    },
    {
      title: "Design System Component Library",
      description:
        "Comprehensive UI component library built with React and Tailwind CSS, featuring reusable components and design tokens.",
      technologies: ["React", "Tailwind CSS", "Storybook", "JavaScript"],
      link: "https://github.com/varunsehgal02",
      demo: "https://component-library-demo.vercel.app",
      image: "/component-library.png",
    },
  ]

  return (
    <section
      id="projects"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-black relative overflow-hidden"
    >
      {/* Network Effect Background */}
      <div className="absolute inset-0 w-full h-full opacity-30">
        <NetworkEffect />
      </div>


      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-balance text-white animate-fade-in-up">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 animate-gradient-text">Projects</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-900/50 rounded-lg overflow-hidden border-2 border-red-600/20 hover:border-red-600 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-600/30 animate-fade-in-up group perspective-1000"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-48 bg-gray-800 overflow-hidden relative group-hover:transform group-hover:rotate-y-5 transition-transform duration-500">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="p-6 group-hover:transform group-hover:translate-y-[-2px] transition-transform duration-300">
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-red-400 transition-colors duration-300">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="px-2 py-1 bg-red-600/20 text-red-300 rounded text-xs font-medium group-hover:bg-red-600/30 group-hover:text-red-200 transition-all duration-300">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm text-center group-hover:shadow-lg group-hover:shadow-red-600/50"
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 border-2 border-red-600 text-red-300 hover:bg-red-600 hover:text-white rounded font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm text-center group-hover:border-red-500 group-hover:shadow-lg group-hover:shadow-red-600/25"
                  >
                    View Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
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
            opacity: 0.2;
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
            opacity: 0.6;
          }
        }

        @keyframes gradient-text {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 3s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .rotate-y-5 {
          transform: rotateY(5deg);
        }
      `}</style>
    </section>
  )
}
