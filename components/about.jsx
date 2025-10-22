"use client"

export default function About() {
  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900/50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-balance text-white animate-fade-in-up">
          About <span className="text-red-500">Me</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <p className="text-lg text-gray-300 leading-relaxed hover:text-white transition-colors duration-300">
              I'm <span className="text-red-500 font-semibold">Varun Sehgal</span>, a passionate Frontend & UI/UX
              Developer with a keen eye for creating beautiful, intuitive digital experiences. Currently pursuing B.Tech
              in Computer Science & Engineering at JUET, Guna, I'm in my 3rd year and actively seeking internship
              opportunities.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed hover:text-white transition-colors duration-300">
              My journey in web development started with a curiosity about how things work on the web. Over time, I've
              honed my skills in React, Tailwind CSS, and interactive 3D experiences with Three.js. I believe in writing
              clean, maintainable code and creating interfaces that are both beautiful and functional.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed hover:text-white transition-colors duration-300">
              When I'm not coding, you can find me exploring new design trends, contributing to open-source projects, or
              experimenting with new web technologies. I'm always eager to learn and grow as a developer.
            </p>
          </div>

          <div
            className="bg-gray-900/50 rounded-lg p-8 border-2 border-red-600/30 hover:border-red-600 transition-all duration-300 animate-fade-in-up transform hover:scale-105"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-2xl font-bold mb-6 text-white">Quick Facts</h3>
            <div className="space-y-4">
              <div className="pb-4 border-b border-red-600/20 hover:border-red-600 transition-colors">
                <p className="text-sm text-gray-400">Location</p>
                <p className="font-semibold text-white">Guna, Madhya Pradesh, India</p>
              </div>
              <div className="pb-4 border-b border-red-600/20 hover:border-red-600 transition-colors">
                <p className="text-sm text-gray-400">Status</p>
                <p className="font-semibold text-white">B.Tech 3rd Year Student</p>
              </div>
              <div className="pb-4 border-b border-red-600/20 hover:border-red-600 transition-colors">
                <p className="text-sm text-gray-400">Specialization</p>
                <p className="font-semibold text-white">Frontend Development & UI/UX Design</p>
              </div>
              <div className="pb-4 border-b border-red-600/20 hover:border-red-600 transition-colors">
                <p className="text-sm text-gray-400">Phone</p>
                <p className="font-semibold text-white">+91 9399361193</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-semibold text-white">varun.sehgal02@gmail.com</p>
              </div>
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
