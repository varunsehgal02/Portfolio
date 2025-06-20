"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
  }, [isMenuOpen])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Education", href: "#education" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || isMenuOpen
          ? "bg-black backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo (left) */}
        <Link href="/" className="text-2xl font-bold text-white">
          Varun<span className="text-gray-400 font-semibold">Sehgal</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors font-semibold"
            >
              {link.name}
            </Link>
          ))}
          <Button
            asChild
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black font-semibold"
          >
            <a href="/Varun_Sehgal_Resume.pdf" download>
              Resume
            </a>
          </Button>
        </nav>

        {/* Mobile Menu Toggle (Only when menu is closed) */}
        {!isMenuOpen && (
          <button className="md:hidden text-white z-50 mr-2.5" onClick={toggleMenu}>
            <Menu size={24} />
          </button>
        )}
      </div>

      {/* Backdrop when mobile menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Slide-in Mobile Navigation Panel */}
      <div
        className={`fixed top-0 right-2 h-full w-64 bg-black text-white transform transition-transform duration-300 ease-in-out z-50 shadow-xl ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-white/10">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={toggleMenu}>
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col items-start p-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white transition-colors text-base font-semibold"
            >
              {link.name}
            </Link>
          ))}
          <Button
            asChild
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black mt-4 font-semibold"
          >
            <a href="/Varun_Sehgal_Resume.pdf" download>
              Resume
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
