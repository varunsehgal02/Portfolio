import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-8 bg-black border-t border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold text-white">
              Varun<span className="text-gray-400">Sehgal</span>
            </Link>
          </div>

          <div className="flex gap-6 mb-4 md:mb-0">
            <a
              href="https://github.com/varunsehgal02"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors "
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/varunsehgal02"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors "
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            
          </div>

          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Varun Sehgal. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
