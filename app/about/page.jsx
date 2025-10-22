import Navigation from "@/components/navigation"

export default function About() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-balance">About Me</h1>

          <div className="space-y-6 text-lg text-muted-foreground">
            <p>
              I'm a passionate Frontend & UI/UX Developer focused on building modern, responsive, and user-friendly web
              applications. With a keen eye for design and usability, I love creating interfaces that are both visually
              engaging and intuitive to use.
            </p>

            <p>
              I specialize in React, JavaScript, Tailwind CSS, and Three.js, combining creativity and performance to
              deliver seamless digital experiences. I also work with design tools like Figma, Canva, and Adobe Lightroom
              to transform ideas into clean, polished prototypes that turn into fully functional web experiences.
            </p>

            <p>
              Currently pursuing B.Tech in Computer Science Engineering (3rd Year), I'm eager to bring innovation and
              detail-oriented design to real-world projects and internships.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-3 text-lg">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a href="mailto:varun.sehgal02@gmail.com" className="text-primary hover:underline">
                  varun.sehgal02@gmail.com
                </a>
              </p>
              <p>
                <span className="font-semibold">Phone:</span> 9399361193
              </p>
              <p>
                <span className="font-semibold">GitHub:</span>{" "}
                <a
                  href="https://github.com/varunsehgal02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/varunsehgal02
                </a>
              </p>
              <p>
                <span className="font-semibold">LinkedIn:</span>{" "}
                <a
                  href="https://linkedin.com/in/varunsehgal02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  linkedin.com/in/varunsehgal02
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
