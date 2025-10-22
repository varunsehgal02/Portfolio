"use client"

import { useState } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8  relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-white animate-fade-in-up">
          Let's Work <span className="text-red-500">Together</span>
        </h2>
        <p className="text-xl text-gray-300 mb-12 text-balance animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          I'm always interested in hearing about new projects and opportunities. Feel free to reach out!
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-2xl font-bold text-white">Send me a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2 bg-gray-900/50 border-2 border-red-600/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-red-600 transition-colors duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-gray-900/50 border-2 border-red-600/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-red-600 transition-colors duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  rows="5"
                  className="w-full px-4 py-2 bg-gray-900/50 border-2 border-red-600/20 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-red-600 transition-colors duration-300 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-red-600/50"
              >
                {submitted ? "✓ Message Sent!" : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-2xl font-bold text-white">Get in touch</h3>

            <div className="space-y-6">
              <div className="p-4 bg-gray-900/50 rounded-lg border-2 border-red-600/20 hover:border-red-600 transition-all duration-300">
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <a
                  href="mailto:varun.sehgal02@gmail.com"
                  className="text-lg font-semibold text-white hover:text-red-500 transition-colors duration-300"
                >
                  varun.sehgal02@gmail.com
                </a>
              </div>

              <div className="p-4 bg-gray-900/50 rounded-lg border-2 border-red-600/20 hover:border-red-600 transition-all duration-300">
                <p className="text-sm text-gray-400 mb-1">Phone</p>
                <a
                  href="tel:+919399361193"
                  className="text-lg font-semibold text-white hover:text-red-500 transition-colors duration-300"
                >
                  +91 9399361193
                </a>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-3">Social Links</p>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/varunsehgal02"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-medium transform hover:scale-105"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/varunsehgal02"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-medium transform hover:scale-105"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://x.com/varunsehgal02"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-medium transform hover:scale-105"
                  >
                    X
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-red-600/20">
              <p className="text-sm text-gray-500">
                © 2025 Varun Sehgal. All rights reserved. | Built with React, Tailwind CSS & Three.js
              </p>
            </div>
          </div>
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
