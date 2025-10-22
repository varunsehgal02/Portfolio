import Navigation from "@/components/navigation"

export default function Projects() {
  const projects = [
    {
      name: "Figma-Portfolio",
      description: "A portfolio website designed in Figma and built with React",
      link: "https://github.com/varunsehgal02/Figma-Portfolio",
    },
    {
      name: "ThreeJs",
      description: "Interactive 3D visualizations using Three.js",
      link: "https://github.com/varunsehgal02/ThreeJs",
    },
    {
      name: "Dalle_clone",
      description: "A clone of DALL-E image generation interface",
      link: "https://github.com/varunsehgal02/Dalle_clone",
    },
    {
      name: "Weather_Web",
      description: "Real-time weather application with API integration",
      link: "https://github.com/varunsehgal02/Weather_Web",
    },
    {
      name: "Google_page",
      description: "Recreation of Google homepage",
      link: "https://github.com/varunsehgal02/Google_page",
    },
    {
      name: "Pokemon_Img_Generator",
      description: "Generate random Pokémon images with details",
      link: "https://github.com/varunsehgal02/Pokemon_Img_Generator",
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-12 text-balance">Projects</h1>

          <div className="grid gap-6">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 border border-border rounded-lg hover:bg-card transition-colors group"
              >
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
