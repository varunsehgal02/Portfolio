"use client"

import { useState } from "react"

export default function Skills() {
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

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-balance text-white animate-fade-in-up">
          Skills & <span className="text-red-500">Expertise</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-gray-900/50 rounded-lg p-6 border-2 border-red-600/20 hover:border-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-xl font-bold mb-4 text-white">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <button
                    key={skillIndex}
                    onClick={() => setSelectedSkill(skill)}
                    className="px-3 py-1 bg-red-600/20 text-red-300 rounded-full text-sm font-medium hover:bg-red-600/40 transition-all duration-300 cursor-pointer transform hover:scale-110 active:scale-95 shadow-md hover:shadow-lg hover:shadow-red-600/30"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedSkill && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-red-600 rounded-lg p-8 max-w-md w-full animate-scale-in transform transition-all duration-300 shadow-2xl shadow-red-600/30">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">{selectedSkill}</h3>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-gray-400 hover:text-red-500 transition-colors text-2xl hover:scale-110 transform duration-300"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">{languageInfo[selectedSkill]}</p>
            <button
              onClick={() => setSelectedSkill(null)}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-red-600/50"
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
            transform: scale(0.9) rotateX(10deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotateX(0deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}
