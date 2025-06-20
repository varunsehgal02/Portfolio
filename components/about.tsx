import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Github, Linkedin } from "lucide-react"
import { AnimateIn } from "./animate-in"

export default function About() {
  return (
    <section id="about" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <AnimateIn>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">About Me</h2>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-12 items-center ">
          <div className="order-2 md:order-1">
            <AnimateIn delay={0.2}>
              <p className="text-gray-300 mb-6">
                I'm a passionate Frontend and UI/UX Developer with expertise in creating visually appealing and
                user-friendly interfaces. My technical skills include proficiency in React, Next.js, Three.js, and
                various frontend frameworks, allowing me to build responsive and interactive web applications.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.3}>
              <p className="text-gray-300 mb-6">
                With a strong foundation in both design and development, I bridge the gap between aesthetics and
                functionality. I'm experienced in translating Figma designs into pixel-perfect code, optimizing user
                experiences, and implementing modern UI patterns that enhance usability and engagement.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.4}>
              <p className="text-gray-300 mb-6">
                I'm constantly exploring new technologies and design trends to stay at the cutting edge of web
                development, and I'm passionate about creating solutions that are not only visually stunning but also
                performant and accessible.
              </p>
            </AnimateIn>

            <AnimateIn delay={0.5}>
              <div className="flex gap-4 mb-8">
                {/* EDIT: Update your social links here */}
                <a
                  href="https://github.com/varunsehgal02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
                <a
                  href="https://linkedin.com/in/varunsehgal02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
               
              </div>

              <Button asChild className="bg-white text-black hover:bg-gray-200">
              <a href="/Varun_Sehgal_Resume.pdf" download>
              Resume
            </a>
              </Button>
            </AnimateIn>
          </div>

          <AnimateIn
            from={{ opacity: 0, x: 50 }}
            to={{ opacity: 1, x: 0 }}
            className="order-1 md:order-2 flex justify-center"
          >
            {/* EDIT: Replace with your profile image */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white">
              <Image src="photo_v.jpeg" alt="Varun Sehgal" fill className="object-cover" />
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
