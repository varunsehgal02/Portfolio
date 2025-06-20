"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"
import { AnimateIn } from "./animate-in"
import { motion } from "framer-motion"
import emailjs from 'emailjs-com' // ADD THIS IMPORT

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSending, setIsSending] = useState(false) // To show "Sending..."

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    const serviceID = 'THEYCALLMENOOB'
    const templateID = 'template_sk3qwlh'
    const publicKey = 'x_1fkyRzgDYPJl3-M'

    emailjs.send(serviceID, templateID, formData, publicKey)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text)
        alert("Thank you for your message! I'll get back to you soon.")
        setFormData({ name: "", email: "", subject: "", message: "" })
      })
      .catch((error) => {
        console.error('FAILED...', error)
        alert("Oops, something went wrong. Please try again!")
      })
      .finally(() => {
        setIsSending(false)
      })
  }

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <AnimateIn>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Contact Me</h2>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-12">
          <AnimateIn from={{ opacity: 0, x: -30 }} to={{ opacity: 1, x: 0 }}>
            <h3 className="text-2xl font-bold mb-6 text-white">Get In Touch</h3>
            <p className="text-gray-300 mb-8">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </p>

            <div className="space-y-6">
              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Mail className="h-6 w-6 mr-4 text-gray-400" />
                <div>
                  <h4 className="font-medium text-white">Email</h4>
                  <p className="text-gray-400">varun.sehgal02@gmail.com</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Phone className="h-6 w-6 mr-4 text-gray-400" />
                <div>
                  <h4 className="font-medium text-white">Phone</h4>
                  <p className="text-gray-400">+91 9399361193</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <MapPin className="h-6 w-6 mr-4 text-gray-400" />
                <div>
                  <h4 className="font-medium text-white">Location</h4>
                  <p className="text-gray-400">India</p>
                </div>
              </motion.div>
            </div>
          </AnimateIn>

          <AnimateIn from={{ opacity: 0, x: 30 }} to={{ opacity: 1, x: 0 }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-zinc-900 border-zinc-700 focus-visible:ring-white text-white"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-zinc-900 border-zinc-700 focus-visible:ring-white text-white"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="bg-zinc-900 border-zinc-700 focus-visible:ring-white text-white"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="bg-zinc-900 border-zinc-700 focus-visible:ring-white min-h-[150px] text-white"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={isSending}>
                  {isSending ? "Sending..." : "Send Message"}
                </Button>
              </motion.div>
            </form>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
