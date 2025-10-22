"use client"

import { useState, useEffect, useRef } from "react"

export default function Skills() {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)
  const [hoveredSkill, setHoveredSkill] = useState(null)

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
      const particleCount = 20

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
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
        particle.pulse += 0.01

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Draw particle with pulsing effect
        const pulseSize = particle.radius + Math.sin(particle.pulse) * 0.3
        ctx.save()
        ctx.shadowColor = particle.color
        ctx.shadowBlur = 6
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity + Math.sin(particle.pulse) * 0.1
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw connections
      ctx.strokeStyle = "rgba(239, 68, 68, 0.08)"
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 80) {
            ctx.globalAlpha = 1 - distance / 80
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

  const languageInfo = {
    React: "A JavaScript library for building user interfaces with reusable components and efficient rendering.",
    "Next.js": "A React framework for production with server-side rendering, static generation, and API routes.",
    JavaScript: "A versatile programming language that powers interactive web applications and modern development.",
    HTML5: "The latest markup language for creating semantic and accessible web content.",
    CSS3: "Advanced styling language with animations, flexbox, grid, and modern layout techniques.",
    "Tailwind CSS": "A utility-first CSS framework for rapidly building custom designs without leaving HTML.",
    SASS: "A CSS preprocessor that adds variables, nesting, and functions to enhance CSS development.",
    "Responsive Design":
      "Designing web applications that work seamlessly across all device sizes and screen resolutions.",
    Figma: "A collaborative design tool for creating UI/UX designs, prototypes, and design systems.",
    "Adobe Lightroom": "Professional photo editing and management software for photographers and designers.",
    Canva: "An easy-to-use design platform for creating graphics, presentations, and marketing materials.",
    "User Research":
      "The process of understanding user needs, behaviors, and pain points through various research methods.",
    Wireframing: "Creating low-fidelity layouts to plan the structure and flow of user interfaces.",
    Prototyping: "Building interactive mockups to test and validate design concepts before development.",
    "Design Systems": "A collection of reusable components and guidelines for consistent design across products.",
    "Three.js": "A JavaScript 3D library for creating interactive 3D graphics and animations in the browser.",
    "Canvas API": "A JavaScript API for drawing graphics and animations directly on HTML canvas elements.",
    WebGL: "A web standard for rendering 3D graphics using the GPU for high-performance visualizations.",
    "3D Modeling Basics": "Fundamental concepts of creating 3D objects, meshes, and scenes for web applications.",
    "Node.js": "A JavaScript runtime for building server-side applications and backend services.",
    "Express.js": "A minimal and flexible Node.js web application framework for building APIs and web servers.",
    MongoDB: "A NoSQL database that stores data in flexible JSON-like documents.",
    MySQL: "A relational database management system for storing and managing structured data.",
    Firebase: "A Google platform providing backend services like authentication, database, and hosting.",
    AWS: "Amazon Web Services offering cloud computing, storage, and various backend services.",
    Azure: "Microsoft's cloud platform for building, deploying, and managing applications.",
    Python: "A versatile programming language known for simplicity and used in data science and automation.",
    Java: "An object-oriented programming language widely used for enterprise applications.",
    C: "A low-level programming language fundamental to computer science and systems programming.",
    "C++": "An extension of C with object-oriented features, used for performance-critical applications.",
    Dart: "A programming language developed by Google, primarily used for Flutter mobile development.",
    Git: "A version control system for tracking changes and collaborating on code projects.",
    GitHub: "A platform for hosting Git repositories and collaborating on software development.",
    GitLab: "A DevOps platform providing Git repository management and CI/CD capabilities.",
    Bitbucket: "A Git repository hosting service with built-in CI/CD and team collaboration features.",
    Docker: "A containerization platform for packaging applications and their dependencies.",
    NPM: "Node Package Manager for managing JavaScript packages and dependencies.",
    Vite: "A modern build tool and development server for fast and optimized web development.",
    "Vue.js": "A progressive JavaScript framework for building user interfaces and single-page applications.",
    "React Native": "A framework for building native mobile applications using React and JavaScript.",
  }

  const skillCategories = [
    {
      category: "Frontend Development",
      skills: ["React", "Next.js", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "SASS", "Responsive Design"],
    },
    {
      category: "UI/UX Design",
      skills: ["Figma", "Adobe Lightroom", "Canva", "User Research", "Wireframing", "Prototyping", "Design Systems"],
    },
    {
      category: "3D & Graphics",
      skills: ["Three.js", "Canvas API", "WebGL", "3D Modeling Basics"],
    },
    {
      category: "Backend & Tools",
      skills: ["Node.js", "Express.js", "MongoDB", "MySQL", "Firebase", "AWS", "Azure"],
    },
    {
      category: "Other Languages",
      skills: ["Python", "Java", "C", "C++", "Dart"],
    },
    {
      category: "Developer Tools",
      skills: ["Git", "GitHub", "GitLab", "Bitbucket", "Docker", "NPM", "Vite", "Vue.js", "React Native"],
    },
  ]

  const [selectedSkill, setSelectedSkill] = useState(null)

  // Skill levels for progress bars
  const skillLevels = {
    React: 90,
    "Next.js": 85,
    JavaScript: 88,
    HTML5: 95,
    CSS3: 92,
    "Tailwind CSS": 90,
    SASS: 80,
    "Responsive Design": 88,
    Figma: 85,
    "Adobe Lightroom": 75,
    Canva: 80,
    "User Research": 70,
    Wireframing: 75,
    Prototyping: 80,
    "Design Systems": 75,
    "Three.js": 70,
    "Canvas API": 65,
    WebGL: 60,
    "3D Modeling Basics": 55,
    "Node.js": 75,
    "Express.js": 70,
    MongoDB: 65,
    MySQL: 70,
    Firebase: 80,
    AWS: 60,
    Azure: 55,
    Python: 75,
    Java: 70,
    C: 65,
    "C++": 70,
    Dart: 60,
    Git: 85,
    GitHub: 90,
    GitLab: 75,
    Bitbucket: 70,
    Docker: 60,
    NPM: 85,
    Vite: 80,
    "Vue.js": 70,
    "React Native": 65,
  }

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Interactive Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "transparent" }}
      />

      {/* Enhanced Background Effects */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-red-600/3 to-blue-600/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-balance text-white animate-fade-in-up">
          Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 animate-gradient-text">Expertise</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-gray-900/50 rounded-lg p-6 border-2 border-red-600/20 hover:border-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20 animate-fade-in-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-red-400 transition-colors duration-300">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <button
                    key={skillIndex}
                    onClick={() => setSelectedSkill(skill)}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className="px-3 py-1 bg-red-600/20 text-red-300 rounded-full text-sm font-medium hover:bg-red-600/40 transition-all duration-300 cursor-pointer transform hover:scale-110 hover:shadow-lg hover:shadow-red-600/30 relative overflow-hidden group/skill"
                  >
                    <span className="relative z-10">{skill}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-600/20 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Progress bar for hovered skill */}
                    {hoveredSkill === skill && (
                      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                           style={{ width: `${skillLevels[skill] || 70}%` }}></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Top Skills Progress Section */}
        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <h3 className="text-2xl font-bold mb-8 text-white text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 animate-gradient-text">Proficiency Levels</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { skill: "React", level: 90, color: "from-blue-500 to-cyan-500" },
              { skill: "JavaScript", level: 88, color: "from-yellow-500 to-orange-500" },
              { skill: "CSS3", level: 92, color: "from-blue-600 to-purple-600" },
              { skill: "Next.js", level: 85, color: "from-gray-600 to-gray-800" },
              { skill: "Tailwind CSS", level: 90, color: "from-cyan-500 to-blue-500" },
              { skill: "Three.js", level: 70, color: "from-green-500 to-emerald-500" }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium group-hover:text-red-400 transition-colors duration-300">{item.skill}</span>
                  <span className="text-gray-400 text-sm">{item.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg group-hover:shadow-red-500/30`}
                    style={{ width: `${item.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedSkill && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-8 max-w-md w-full animate-scale-in transform transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">{selectedSkill}</h3>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-gray-400 hover:text-red-500 transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">{languageInfo[selectedSkill]}</p>
            <button
              onClick={() => setSelectedSkill(null)}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

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

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
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

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
