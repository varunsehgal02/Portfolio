"use client"

import { useState } from "react"
import MouseFollowingModel from "./mouse-following-model"

export default function Hero({ userName }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [modelColor, setModelColor] = useState("red")
  const [showColorPicker, setShowColorPicker] = useState(false)

  const colors = [
    { name: "red", value: "#ef4444" },
    { name: "yellow", value: "#eab308" },
    { name: "blue", value: "#3b82f6" },
    { name: "green", value: "#22c55e" },
    { name: "white", value: "#ffffff" },
  ]

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
            <p className="text-red-500 font-semibold mb-2 text-lg">Hi, I'm Varun Sehgal 👋</p>
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

        {/* Right Side - 3D Model with Controls */}
        <div className="relative">
          <div className="hidden md:block h-screen md:h-96 lg:h-[500px] animate-fade-in-right">
            <MouseFollowingModel isFollowing={isFollowing} modelColor={modelColor} />
          </div>

          <div className="fixed bottom-8 right-8 z-40 space-y-4">
            {/* Color Picker */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-12 h-12 rounded-full border-2 border-white hover:border-red-500 transition-all duration-300 flex items-center justify-center text-white font-bold hover:scale-110 shadow-lg"
                style={{ backgroundColor: colors.find((c) => c.name === modelColor)?.value }}
                title="Color Picker"
              >
                🎨
              </button>

              {showColorPicker && (
                <div className="absolute bottom-16 right-0 bg-gray-900 border-2 border-red-600 rounded-lg p-4 space-y-2 animate-fade-in shadow-lg shadow-red-600/30">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setModelColor(color.name)
                        setShowColorPicker(false)
                      }}
                      className="w-full px-4 py-2 rounded text-white font-semibold transition-all duration-300 hover:scale-105 capitalize"
                      style={{ backgroundColor: color.value, color: color.name === "white" ? "black" : "white" }}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Follow/Not Follow Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setIsFollowing(true)}
                className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-bold hover:scale-110 shadow-lg ${
                  isFollowing
                    ? "bg-red-600 border-red-600 text-white shadow-red-600/50"
                    : "border-white text-white hover:border-red-500"
                }`}
                title="Follow Mouse"
              >
                👁️
              </button>

              <button
                onClick={() => setIsFollowing(false)}
                className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-bold hover:scale-110 shadow-lg ${
                  !isFollowing
                    ? "bg-red-600 border-red-600 text-white shadow-red-600/50"
                    : "border-white text-white hover:border-red-500"
                }`}
                title="Return to Place"
              >
                🏠
              </button>
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

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out 0.2s both;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}
