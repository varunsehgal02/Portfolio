"use client"

export default function Education() {
  const educationData = [
    {
      type: "University",
      institution: "JUET, Guna",
      degree: "Bachelor of Technology",
      field: "Computer Science & Engineering",
      year: "2023 - 2027",
      current: "3rd Year",
      description: "Pursuing B.Tech in CSE with focus on web development and UI/UX design.",
      icon: "🎓",
    },
    {
      type: "Senior Secondary",
      institution: "SKR, Dabra",
      degree: "12th Grade",
      field: "Science Stream",
      year: "2021 - 2023",
      description: "Completed senior secondary education with strong foundation in mathematics and science.",
      icon: "📚",
    },
    {
      type: "Secondary",
      institution: "SKR, Dabra",
      degree: "10th Grade",
      field: "General",
      year: "2019 - 2021",
      description: "Completed secondary education with excellent academic performance.",
      icon: "📖",
    },
  ]

  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-balance text-white animate-fade-in-up">
          Education & <span className="text-red-500">Background</span>
        </h2>

        <div className="space-y-6">
          {educationData.map((edu, index) => (
            <div
              key={index}
              className="bg-gray-900/50 rounded-lg p-6 border-2 border-red-600/20 hover:border-red-600 transition-all duration-300 transform hover:translate-x-2 hover:shadow-lg hover:shadow-red-600/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{edu.icon}</div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-white">{edu.institution}</h3>
                    <span className="text-sm text-red-400 font-semibold">{edu.year}</span>
                  </div>
                  <p className="text-lg text-red-400 font-semibold mb-1">{edu.degree}</p>
                  <p className="text-gray-400 mb-2">{edu.field}</p>
                  {edu.current && <p className="text-sm text-red-500 font-semibold mb-2">Current: {edu.current}</p>}
                  <p className="text-gray-300">{edu.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline visualization */}
        <div className="mt-12 pt-12 border-t border-red-600/20">
          <h3 className="text-2xl font-bold text-white mb-8 animate-fade-in-up">Learning Journey</h3>
          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-600/20 transform md:-translate-x-1/2" />

            <div className="space-y-8 md:space-y-12">
              {[
                { year: "2019", event: "Started Secondary Education" },
                { year: "2021", event: "Completed 10th Grade" },
                { year: "2023", event: "Completed 12th Grade & Started B.Tech" },
                { year: "2025", event: "Currently in 3rd Year of B.Tech" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="md:flex md:gap-8 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="md:w-1/2 md:text-right md:pr-8">
                    <p className="text-red-500 font-bold text-lg">{item.year}</p>
                  </div>
                  <div className="md:w-1/2 md:pl-8 mt-2 md:mt-0">
                    <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-red-600 rounded-full transform -translate-x-1.5 md:-translate-x-1.5 mt-1" />
                    <p className="text-white font-semibold">{item.event}</p>
                  </div>
                </div>
              ))}
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
