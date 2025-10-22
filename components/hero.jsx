"use client"

import HeroHumanModel from "./hero-human-model"

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

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="flex flex-col gap-6 animate-fade-in-up">
          <div>
            <p className="text-red-500 font-semibold mb-2 text-lg animate-text-glow">Hi, I'm Varun Sehgal 👋</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance leading-tight">
              Frontend & <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 animate-gradient-text">UI/UX</span> Developer
            </h1>
            <p className="text-xl text-gray-300 mb-6 text-balance leading-relaxed hover:text-white transition-colors duration-300">
              I craft modern, responsive web applications with a focus on user experience and clean design. Specializing
              in React, Tailwind CSS, and Three.js.
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => handleScroll("#projects")}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-600/50 hover:shadow-2xl group"
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
            <button
              onClick={() => handleScroll("#contact")}
              className="px-8 py-3 border-2 border-red-600 text-white hover:bg-red-600/10 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 hover:border-red-500 hover:shadow-lg hover:shadow-red-600/25"
            >
              Get In Touch
            </button>
          </div>

          {/* Enhanced Social Links */}
          <div className="flex gap-6 pt-4">
            {[
              { name: "GitHub", href: "https://github.com/varunsehgal02", icon: "🐙" },
              { name: "LinkedIn", href: "https://linkedin.com/in/varunsehgal02", icon: "💼" },
              { name: "X", href: "https://x.com/varunsehgal02", icon: "🐦" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-all duration-300 font-medium group flex items-center gap-2 hover:scale-110 transform"
              >
                <span className="text-lg group-hover:animate-bounce">{social.icon}</span>
                {social.name}
              </a>
            ))}
          </div>
        </div>

        <div className="block h-screen md:h-96 lg:h-[500px] animate-fade-in-right">
          <HeroHumanModel />
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes gradient-text {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.6);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out 0.2s both;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 3s ease-in-out infinite;
        }

        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
