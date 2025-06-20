import About from "@/components/about"
import Contact from "@/components/contact"
import Education from "@/components/education"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import Projects from "@/components/projects"
import Skills from "@/components/skills"

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Hero />
      <About />
      <Skills />
      <Education />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}
