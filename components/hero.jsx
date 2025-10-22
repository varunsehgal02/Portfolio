"use client"

import MouseFollowingModel from "./mouse-following-model"

export default function Hero({ userName }) {
  const handleScroll = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="home"
      className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center relative overflow-hidden"
    >
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-72 h-72 bg-red-600/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="flex flex-col gap-6 animate-fade-in-up">
          <div>
            <p className="text-red-500 font-semibold mb-2 text-lg">Hi, I’m Varun Sehgal 👋</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance leading-tight">
              Frontend & <span className="text-red-500">UI/UX</span> Developer
            </h1>
            <p className="text-xl text-gray-300 mb-6 text-balance leading-relaxed">
              I craft modern, responsive web applications with a focus on user experience and clean design. Specializing
              in React, Tailwind CSS, and Three.js.
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => handleScroll("#projects")}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-red-600/50"
            >
              View My Work
            </button>
            <button
              onClick={() => handleScroll("#contact")}
              className="px-8 py-3 border-2 border-red-600 text-white hover:bg-red-600/10 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Get In Touch
            </button>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 pt-4">
            <a
              href="https://github.com/varunsehgal02"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-red-500 transition-colors duration-300 font-medium"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/varunsehgal02"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-red-500 transition-colors duration-300 font-medium"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/varunsehgal02"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-red-500 transition-colors duration-300 font-medium"
            >
              X
            </a>
          </div>
        </div>

        <div className="hidden md:block h-screen md:h-96 lg:h-[500px] animate-fade-in-right">
          <MouseFollowingModel />
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

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out 0.2s both;
        }
      `}</style>
    </section>
  )
}
