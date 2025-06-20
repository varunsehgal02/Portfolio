"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { AnimateIn, AnimateInStagger } from "./animate-in"
import { motion } from "framer-motion"

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all")

  const filters = [
    { id: "all", label: "All" },
    { id: "Figma", label: "Figma" },
    { id: "React.js", label: "React" },
    { id: "JavaScript", label: "JavaScript" },
    { id: "HTML", label: "HTML" },
    { id: "Css", label: "CSS" },
    { id: "Python", label: "Python" },
  ]

  // EDIT: Update your projects here
  const projects = [
    
    {
      title: "ThreeJs",
      description: "Interactive 3D web experience built with Three.js and JavaScript.",
      image: "three_w.png",
      tags: ["JavaScript", "Three.js"],
      // liveUrl: "https://github.com/varunsehgal02/ThreeJs",
      githubUrl: "https://github.com/varunsehgal02/ThreeJs",
    },
    {
      title: "Open Source",
      description: "Contributions to open source projects and community initiatives.",
      image: "open_s.png",
      tags: ["JavaScript", "HTML", "Css","React.js"],
      // liveUrl: "https://github.com/varunsehgal02/Open_Source",
      githubUrl: "https://github.com/varunsehgal02/Open_Source",
    },
    {
      title: "DALLE Clone",
      description: "A clone of the DALLE image generation platform with custom UI and features.",
      image: "image_ai.png",
      tags: ["React.js", "JavaScript","Tailwind"],
      // liveUrl: "https://github.com/varunsehgal02/Dalle_clone",
      githubUrl: "https://github.com/varunsehgal02/Dalle_clone",
    },
    {
      title: "Weather Web",
      description: "A responsive weather application with real-time data and interactive UI.",
      image: "clould.jpg",
      tags: ["HTML","Css","JavaScript"],
      // liveUrl: "https://github.com/varunsehgal02/Weather_Web",
      githubUrl: "https://github.com/varunsehgal02/Weather_Web",
    },

    {
      title: "Full Stack Web Development Python",
      description: "A collection of full-stack web development projects using Python.",
      image: "pyhton-f2.jpeg",
      tags: ["Python", "HTML"],
      // liveUrl: "https://github.com/varunsehgal02/Full-Stack-Web-Development-Python",
      githubUrl: "https://github.com/varunsehgal02/Full-Stack-Web-Development-Python",
    },
    {
      title: "Simple Chatbot",
      description: "A simple chatbot implementation with natural language processing capabilities.",
      image: "chatbot.jpg",
      tags: ["JavaScript"],
      // liveUrl: "https://github.com/varunsehgal02/Simple-Chatbot",
      githubUrl: "https://github.com/varunsehgal02/Simple-Chatbot",
    },
    {
      title: "Pokemon Image Generator",
      description: "An application that generates Pokemon images based on user input.",
      image: "Pokemon-AI-generator.avif",
      tags: ["HTML","Css","JavaScript"],
      // liveUrl: "https://github.com/varunsehgal02/Pokemon_Img_Generator",
      githubUrl: "https://github.com/varunsehgal02/Pokemon_Img_Generator",
    },
    {
      title: "The Odin Project",
      description: "Projects completed as part of The Odin Project curriculum.",
      image: "od.png",
      tags: ["HTML","Css","React.js","JavaScript"],
      // liveUrl: "https://github.com/varunsehgal02/TheOdinProject",
      githubUrl: "https://github.com/varunsehgal02/TheOdinProject",
    },
    {
      title: "GitHub Login Clone",
      description: "A clone of the GitHub login page with responsive design.",
      image: "git.jpg",
      tags: ["HTML","Css","JavaScript"],
      // liveUrl: "https://github.com/varunsehgal02/Github_login_clone",
      githubUrl: "https://github.com/varunsehgal02/Github_login_clone",
    },
    {
      title: "Calculator",
      description: "A simple calculator application with basic arithmetic operations.",
      image: "ca.jpg",
      tags: ["HTML","Css","JavaScript"],
      // liveUrl: "https://github.com/varunsehgal02/CALCULATOR",
      githubUrl: "https://github.com/varunsehgal02/CALCULATOR",
    },
  ]

  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((project) => project.tags.includes(activeFilter))

  return (
    <section id="projects" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <AnimateIn>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Projects</h2>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.id)}
                className={
                  activeFilter === filter.id
                    ? "bg-white text-black hover:bg-gray-200"
                    : "border-white text-white hover:bg-white hover:text-black"
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </AnimateIn>

        <AnimateInStagger className="grid md:grid-cols-2 gap-8" staggerChildren={0.2}>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 bg-black text-white text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-black"
                  >
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </a>
                  </Button>
                  {/* <Button asChild size="sm" className="bg-white text-black hover:bg-gray-200">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button> */}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimateInStagger>
      </div>
    </section>
  )
}
