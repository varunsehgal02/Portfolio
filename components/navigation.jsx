"use client"

import { useState } from "react"

export default function Navigation({ userName }) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
    { label: "Resume", href: "/resume.pdf", isDownload: true },
  ]

  const handleScroll = (href, isDownload = false) => {
    setIsOpen(false)
    
    if (isDownload) {
      // Create a temporary link element to trigger download
      const link = document.createElement('a')
      link.href = href
      link.download = 'Varun_Sehgal_Resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-red-600/30 z-50 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="#home" className="text-2xl font-bold text-white hover:text-red-500 transition-colors duration-300">
            Varun Sehgal
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleScroll(item.href, item.isDownload)}
                className="text-white hover:text-red-500 transition-colors duration-300 font-medium relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden flex flex-col gap-1.5 cursor-pointer">
            <div
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
            <div
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-2 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleScroll(item.href, item.isDownload)}
                className="text-white hover:text-red-500 transition-colors duration-300 font-medium py-2 text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </nav>
  )
}
