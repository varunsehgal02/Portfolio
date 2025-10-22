import Navigation from "@/components/navigation"

export default function Skills() {
  const frontendSkills = [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React",
    "Tailwind CSS",
    "Three.js",
    "Next.js",
    "Vite",
    "SASS",
    "NPM",
  ]

  const designSkills = ["Figma", "Canva", "Adobe Lightroom", "Adobe Lightroom Classic"]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-12 text-balance">Skills</h1>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Frontend Development */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Frontend Development</h2>
              <div className="flex flex-wrap gap-3">
                {frontendSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* UI/UX Design */}
            <div>
              <h2 className="text-3xl font-bold mb-6">UI/UX Design</h2>
              <div className="flex flex-wrap gap-3">
                {designSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
