"use client"

import { CalendarIcon, GraduationCap } from "lucide-react"
import { AnimateIn, AnimateInStagger } from "./animate-in"
import { motion } from "framer-motion"

export default function Education() {
  // EDIT: Update with your education details
  const educationItems = [
    {
      degree: "Bachelor of Technology",
      field: "Computer Science",
      institution: "Jaypee University of Engineering & Technology",
      location: "Guna",
      period: "2023 - 2027",
      description:
        "Studied core computer science subjects including data structures, algorithms, database systems, and web development. Participated in various hackathons and coding competitions.",
    },
    {
      degree: "Higher Secondary Education",
      field: "Science & Mathematics",
      institution: "SANT KANWARRAM H.S.SCHOOL",
      location: "Dabra",
      period: "2021 - 2023",
      description:
        "Completed higher secondary education with focus on Physics, Chemistry, Mathematics and Computer Science.",
    },
  ]

  return (
    <section id="education" className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <AnimateIn>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Education</h2>
        </AnimateIn>

        <AnimateInStagger className="space-y-8 max-w-3xl mx-auto">
          {educationItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-black p-6 rounded-lg border border-zinc-800"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-white p-2 rounded-full mr-4">
                  <GraduationCap className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{item.degree}</h3>
                  <p className="text-gray-400">{item.field}</p>
                </div>
              </div>

              <div className="ml-16">
                <p className="text-white font-medium">{item.institution}</p>
                <p className="text-gray-400 mb-2">{item.location}</p>
                <div className="flex items-center text-gray-400 mb-4">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>{item.period}</span>
                </div>
                <p className="text-gray-300">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimateInStagger>
      </div>
    </section>
  )
}
