"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code, Figma, Layers, Palette, Smartphone, Workflow, Database, Server } from "lucide-react"
import { AnimateIn, AnimateInStagger } from "./animate-in"
import { motion } from "framer-motion"

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", label: "All" },
    { id: "frontend", label: "Frontend", icon: <Code className="mr-2 h-4 w-4" /> },
    { id: "uiux", label: "UI/UX", icon: <Palette className="mr-2 h-4 w-4" /> },
    { id: "backend", label: "Backend", icon: <Server className="mr-2 h-4 w-4" /> },
    { id: "tools", label: "Tools", icon: <Workflow className="mr-2 h-4 w-4" /> },
  ]

  // EDIT: Update your skills here
  const skills = [
    // Frontend Skills
    { name: "HTML5", category: "frontend", icon: <Code className="h-8 w-8 mb-3" /> },
    { name: "CSS3", category: "frontend", icon: <Code className="h-8 w-8 mb-3" /> },
    { name: "JavaScript", category: "frontend", icon: <Code className="h-8 w-8 mb-3" /> },
    { name: "React", category: "frontend", icon: <Code className="h-8 w-8 mb-3" /> },
    // { name: "React Native", category: "frontend", icon: <Smartphone className="h-8 w-8 mb-3" /> },
    { name: "Next.js", category: "frontend", icon: <Code className="h-8 w-8 mb-3" /> },
    { name: "Vue.js", category: "frontend", icon: <Code className="h-8 w-8 mb-3" /> },
    { name: "Three.js", category: "frontend", icon: <Code className="h-8 w-8 mb-3" /> },
    { name: "Chart.js", category: "frontend", icon: <Code className="h-8 w-8 mb-3" /> },
    { name: "SASS", category: "frontend", icon: <Code className="h-8 w-8 mb-3" /> },
    { name: "Tailwind CSS", category: "frontend", icon: <Code className="h-8 w-8 mb-3" /> },
    { name: "Vite", category: "frontend", icon: <Code className="h-8 w-8 mb-3" /> },

    // UI/UX Skills
    { name: "Figma", category: "uiux", icon: <Figma className="h-8 w-8 mb-3" /> },
    { name: "UI/UX Design", category: "uiux", icon: <Layers className="h-8 w-8 mb-3" /> },
    { name: "Responsive Design", category: "uiux", icon: <Smartphone className="h-8 w-8 mb-3" /> },
    { name: "Adobe Lightroom", category: "uiux", icon: <Palette className="h-8 w-8 mb-3" /> },
    { name: "Adobe Lightroom Classic", category: "uiux", icon: <Palette className="h-8 w-8 mb-3" /> },
    { name: "Canva", category: "uiux", icon: <Palette className="h-8 w-8 mb-3" /> },

    // Backend Skills
    { name: "Python", category: "backend", icon: <Server className="h-8 w-8 mb-3" /> },
    { name: "Node.js", category: "backend", icon: <Server className="h-8 w-8 mb-3" /> },
    { name: "Express.js", category: "backend", icon: <Server className="h-8 w-8 mb-3" /> },
    // { name: "Django", category: "backend", icon: <Server className="h-8 w-8 mb-3" /> },
    { name: "C", category: "backend", icon: <Server className="h-8 w-8 mb-3" /> },
    { name: "C++", category: "backend", icon: <Server className="h-8 w-8 mb-3" /> },
    { name: "MongoDB", category: "backend", icon: <Database className="h-8 w-8 mb-3" /> },
    // { name: "Firebase", category: "backend", icon: <Database className="h-8 w-8 mb-3" /> },

    // Tools
    { name: "Git", category: "tools", icon: <Workflow className="h-8 w-8 mb-3" /> },
    { name: "GitHub", category: "tools", icon: <Workflow className="h-8 w-8 mb-3" /> },
    { name: "GitLab", category: "tools", icon: <Workflow className="h-8 w-8 mb-3" /> },
    { name: "Bitbucket", category: "tools", icon: <Workflow className="h-8 w-8 mb-3" /> },
    { name: "NPM", category: "tools", icon: <Workflow className="h-8 w-8 mb-3" /> },
  ]

  const filteredSkills = activeCategory === "all" ? skills : skills.filter((skill) => skill.category === activeCategory)

  return (
    <section id="skills" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <AnimateIn>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Skills</h2>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={
                  activeCategory === category.id
                    ? "bg-white text-black hover:bg-gray-200"
                    : "border-white text-white hover:bg-white hover:text-black"
                }
              >
                {category.icon}
                {category.label}
              </Button>
            ))}
          </div>
        </AnimateIn>

        <AnimateInStagger className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={index}
              className="bg-zinc-900 p-6 rounded-lg text-center border border-zinc-800"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <div className="flex justify-center text-white">{skill.icon}</div>
              <h3 className="font-medium text-white">{skill.name}</h3>
            </motion.div>
          ))}
        </AnimateInStagger>
      </div>
    </section>
  )
}
