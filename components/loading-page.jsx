"use client"

import { useState, useEffect } from "react"

export default function LoadingPage({ onComplete }) {
  const [displayText, setDisplayText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const welcomeText = "Welcome to my portfolio - Varun"
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < welcomeText.length) {
        setDisplayText(welcomeText.substring(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [])

  const handleEnter = () => {
    setIsLoading(true)
    setTimeout(() => {
      onComplete("Varun Sehgal")
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, 0.05) 25%, rgba(255, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.05) 75%, rgba(255, 0, 0, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 0, 0, 0.05) 25%, rgba(255, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.05) 75%, rgba(255, 0, 0, 0.05) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-4">
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-white h-16 flex items-center justify-center">
            <span className="inline-block">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          <p className="text-gray-400 text-lg animate-fade-in-delay mt-10">Let's explore my work</p>

          <button
            onClick={handleEnter}
            disabled={isLoading}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span> Loading...
              </span>
            ) : (
              "Enter Portfolio"
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 1.5s ease-out;
        }
      `}</style>
    </div>
  )
}
