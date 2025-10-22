"use client"

export default function Projects() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-featured e-commerce platform built with React and Node.js, featuring product catalog, shopping cart, and payment integration.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
      link: "https://github.com/varunsehgal02",
      image: "/ecommerce-platform-concept.png",
    },
    {
      title: "3D Portfolio Website",
      description:
        "Interactive portfolio website featuring 3D animations with Three.js and smooth scroll navigation. Showcasing frontend and design skills.",
      technologies: ["React", "Three.js", "Tailwind CSS", "Next.js"],
      link: "https://github.com/varunsehgal02",
      image: "/3d-portfolio.jpg",
    },
    {
      title: "Task Management App",
      description:
        "A collaborative task management application with real-time updates, user authentication, and team collaboration features.",
      technologies: ["React", "Firebase", "Tailwind CSS", "JavaScript"],
      link: "https://github.com/varunsehgal02",
      image: "/task-management-concept.png",
    },
    {
      title: "Weather Dashboard",
      description:
        "Real-time weather dashboard with interactive maps, forecasts, and beautiful UI. Built with React and weather APIs.",
      technologies: ["React", "API Integration", "Chart.js", "Tailwind CSS"],
      link: "https://github.com/varunsehgal02",
      image: "/weather-dashboard.png",
    },
    {
      title: "Social Media Analytics",
      description:
        "Analytics dashboard for social media metrics with data visualization, charts, and performance tracking.",
      technologies: ["React", "Chart.js", "Node.js", "MongoDB"],
      link: "https://github.com/varunsehgal02",
      image: "/analytics-dashboard.png",
    },
    {
      title: "Design System Component Library",
      description:
        "Comprehensive UI component library built with React and Tailwind CSS, featuring reusable components and design tokens.",
      technologies: ["React", "Tailwind CSS", "Storybook", "JavaScript"],
      link: "https://github.com/varunsehgal02",
      image: "/component-library.png",
    },
  ]

  return (
    <section
      id="projects"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-black relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-balance text-white animate-fade-in-up">
          Featured <span className="text-red-500">Projects</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-900/50 rounded-lg overflow-hidden border-2 border-red-600/20 hover:border-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-48 bg-gray-800 overflow-hidden relative">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="px-2 py-1 bg-red-600/20 text-red-300 rounded text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm"
                >
                  View Project
                </a>
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

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
