"use client";

import { motion } from "framer-motion";
import { personalInfo, skills, experience, education, certifications } from "@/data/personal";
import SectionHeading from "@/components/SectionHeading";
import SkillBadge from "@/components/SkillBadge";
import LightPillar from "@/components/LightPillar";

export default function AboutPage() {
    return (
        <div className="relative pt-28 pb-20">
            {/* LightPillar Full Page Background */}
            <div className="fixed inset-0 z-0">
                <LightPillar
                    topColor="#1E4BBD"
                    bottomColor="#60A5FA"
                    intensity={0.4}
                    rotationSpeed={0.3}
                    glowAmount={0.001}
                    pillarWidth={3}
                    pillarHeight={0.4}
                    noiseIntensity={0.5}
                    pillarRotation={25}
                    interactive={false}
                    mixBlendMode="screen"
                    quality="high"
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-bg-primary/60" />
            </div>

            {/* ===== HERO ===== */}
            <section className="relative z-[1] max-w-7xl mx-auto px-6 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Image / Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden relative">
                            {/* Gradient placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 rounded-3xl" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                                        <span className="font-display font-extrabold text-5xl text-white">VS</span>
                                    </div>
                                    <p className="text-text-secondary text-sm mt-4 font-medium">Varun Sehgal</p>
                                </div>
                            </div>
                            {/* Decorative rings */}
                            <div className="absolute inset-8 border border-primary/10 rounded-3xl" />
                            <div className="absolute inset-16 border border-secondary/10 rounded-3xl" />
                        </div>
                        {/* Float elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute top-4 -right-4 glass rounded-2xl px-4 py-3"
                        >
                            <span className="text-2xl">🎨</span>
                            <p className="text-xs text-text-secondary mt-1">Graphic Design</p>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                            className="absolute bottom-8 -left-4 glass rounded-2xl px-4 py-3"
                        >
                            <span className="text-2xl">✨</span>
                            <p className="text-xs text-text-secondary mt-1">UI/UX Design</p>
                        </motion.div>
                    </motion.div>

                    {/* Right: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div>
                            <p className="text-primary-light font-semibold mb-2">About Me</p>
                            <h1 className="font-display font-bold text-4xl sm:text-5xl text-text-primary mb-6">
                                Designing <span className="gradient-text">experiences</span> that matter
                            </h1>
                        </div>
                        <p className="text-text-secondary text-lg leading-relaxed">
                            {personalInfo.summary}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="glass rounded-xl px-5 py-3">
                                <p className="text-primary-light font-bold text-xl">{personalInfo.stats[0].value}</p>
                                <p className="text-text-muted text-xs">{personalInfo.stats[0].label}</p>
                            </div>
                            <div className="glass rounded-xl px-5 py-3">
                                <p className="text-primary-light font-bold text-xl">{personalInfo.stats[1].value}</p>
                                <p className="text-text-muted text-xs">{personalInfo.stats[1].label}</p>
                            </div>
                            <div className="glass rounded-xl px-5 py-3">
                                <p className="text-primary-light font-bold text-xl">{personalInfo.stats[2].value}</p>
                                <p className="text-text-muted text-xs">{personalInfo.stats[2].label}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== EXPERIENCE ===== */}
            <section className="relative z-[1] max-w-7xl mx-auto px-6 mb-24">
                <SectionHeading
                    title="Experience"
                    subtitle="My professional journey in design and creative work."
                />
                <div className="max-w-3xl mx-auto space-y-8">
                    {experience.map((exp, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            className="glass rounded-2xl p-8 card-hover relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary rounded-full" />
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                                <div>
                                    <h3 className="font-display font-bold text-lg text-text-primary">
                                        {exp.role}
                                    </h3>
                                    <p className="text-primary-light text-sm font-medium">{exp.company}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-text-secondary text-sm">{exp.period}</p>
                                    <p className="text-text-muted text-xs">{exp.location}</p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {exp.highlights.map((h, j) => (
                                    <li key={j} className="flex items-start gap-3 text-text-secondary text-sm leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ===== SKILLS ===== */}
            <section className="relative z-[1] max-w-7xl mx-auto px-6 mb-24">
                <SectionHeading
                    title="Skills & Tools"
                    subtitle="Technologies and methodologies I use to bring ideas to life."
                />
                <div className="max-w-4xl mx-auto space-y-10">
                    {Object.entries(skills).map(([category, items], i) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <h3 className="font-display font-semibold text-lg text-text-primary mb-4 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                {category}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {items.map((skill, j) => (
                                    <SkillBadge key={skill} skill={skill} index={j} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ===== EDUCATION ===== */}
            <section className="relative z-[1] max-w-7xl mx-auto px-6 mb-24">
                <SectionHeading title="Education" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto glass rounded-2xl p-8 card-hover"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-lg text-text-primary">{education.degree}</h3>
                            <p className="text-primary-light text-sm font-medium">{education.institution}</p>
                            <p className="text-text-muted text-sm mt-1">{education.period}</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ===== CERTIFICATIONS ===== */}
            <section className="relative z-[1] max-w-7xl mx-auto px-6">
                <SectionHeading title="Certifications" />
                <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {certifications.map((cert, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass rounded-xl p-4 card-hover flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-text-secondary text-sm">{cert}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
