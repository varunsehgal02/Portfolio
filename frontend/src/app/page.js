"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { personalInfo, skills } from "@/data/personal";
import { projects } from "@/data/projects";
import { homePageContent } from "@/data/pageContent";
import { useEditableData } from "@/lib/useEditableData";
import SectionHeading from "@/components/SectionHeading";
import Squares from "@/components/Squares";
import dynamic from "next/dynamic";

const DecryptedText = dynamic(() => import("@/components/DecryptedText"), { ssr: false });
const Folder = dynamic(() => import("@/components/Folder"), { ssr: false });
const LogoLoop = dynamic(() => import("@/components/LogoLoop"), { ssr: false });

export default function Home() {
    const personal = useEditableData("personal", personalInfo);
    const skillsData = useEditableData("skills", skills);
    const projectsData = useEditableData("projects", projects);
    const content = useEditableData("homeContent", homePageContent);

    const allSkills = Object.values(skillsData).flat();
    const featuredProjects = projectsData.slice(0, 3);

    // Typing effect — types, deletes, then types again (loops)
    const [typedText, setTypedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const fullName = "Varun";

    useEffect(() => {
        let timeout;
        if (!isDeleting && typedText.length < fullName.length) {
            // Typing forward
            timeout = setTimeout(() => {
                setTypedText(fullName.slice(0, typedText.length + 1));
            }, 150);
        } else if (!isDeleting && typedText.length === fullName.length) {
            // Pause before deleting
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && typedText.length > 0) {
            // Deleting
            timeout = setTimeout(() => {
                setTypedText(fullName.slice(0, typedText.length - 1));
            }, 80);
        } else if (isDeleting && typedText.length === 0) {
            // Pause before typing again
            timeout = setTimeout(() => setIsDeleting(false), 500);
        }
        return () => clearTimeout(timeout);
    }, [typedText, isDeleting]);

    // Convert skills to LogoLoop format
    const skillLogos = allSkills.map((skill) => ({
        node: (
            <span className="px-5 py-2 rounded-xl text-sm font-medium bg-surface-light text-text-secondary border border-surface-light whitespace-nowrap">
                {skill}
            </span>
        ),
        title: skill,
    }));

    return (
        <>
            {/* ===== FULL PAGE SQUARES BACKGROUND ===== */}
            <div className="fixed inset-0 z-0">
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction="diagonal"
                    borderColor="#222222"
                    hoverFillColor="#E6FF0018"
                />
            </div>

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-text-secondary text-sm">{content.availabilityBadge}</span>
                        </motion.div>

                        {/* Name with looping typing effect */}
                        <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-8xl mb-6 leading-tight">
                            <span className="text-text-primary">Hi, I&apos;m </span>
                            <span className="gradient-text text-glow">
                                {typedText}
                                <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 0.7, repeat: Infinity }}
                                    className="inline-block w-1 h-[0.8em] bg-primary ml-1 align-middle"
                                />
                            </span>
                        </h1>

                        {/* Title with DecryptedText effect */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="font-display text-xl sm:text-2xl lg:text-3xl text-text-secondary mb-4"
                        >
                            <DecryptedText
                                text={content.roleLine}
                                animateOn="view"
                                speed={40}
                                maxIterations={15}
                                sequential
                                revealDirection="start"
                                className="text-text-secondary"
                                encryptedClassName="text-primary/40"
                            />
                        </motion.div>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="text-text-muted text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
                        >
                            {personal.tagline}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link
                                href="/projects"
                                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-black font-semibold text-lg hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                            >
                                {content.ctaPrimary}
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-4 rounded-2xl glass text-text-primary font-semibold text-lg hover:border-primary/30 transition-all duration-300 hover:scale-105"
                            >
                                {content.ctaSecondary}
                            </Link>
                            <a
                                href="/resume/Varun_Sehgal.pdf"
                                download
                                className="px-8 py-4 rounded-2xl border border-primary/30 text-primary-light font-semibold text-lg hover:bg-primary/10 hover:text-text-primary transition-all duration-300 hover:scale-105"
                            >
                                {content.ctaResume || "Download Resume"}
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ===== STATS SECTION ===== */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {personal.stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="glass rounded-2xl p-6 text-center card-hover"
                            >
                                <div className="font-display font-bold text-3xl sm:text-4xl gradient-text mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-text-secondary text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SKILLS TICKER - LogoLoop ===== */}
            <section className="py-12 overflow-hidden border-y border-surface-light">
                <LogoLoop
                    logos={skillLogos}
                    speed={80}
                    direction="left"
                    logoHeight={40}
                    gap={16}
                    hoverSpeed={0}
                    fadeOut
                    fadeOutColor="#0a0a0a"
                    ariaLabel="Skills and tools"
                />
            </section>

            {/* ===== FEATURED PROJECTS with Folder ===== */}
            <section className="py-24 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                    <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <SectionHeading
                        title={content.featuredTitle}
                        subtitle={content.featuredSubtitle}
                    />

                    {/* Project Folders Grid */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
                        {featuredProjects.map((project, i) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                className="glass rounded-2xl p-8 text-center card-hover group"
                            >
                                {/* Folder icon */}
                                <div className="flex justify-center mb-8 mt-4">
                                    <Folder
                                        color="#E6FF00"
                                        size={1.8}
                                        items={[
                                            <div key="p1" className="flex items-center justify-center h-full">
                                                <span className="text-[8px] font-bold text-gray-600 leading-tight text-center px-1">
                                                    {project.tools[0]}
                                                </span>
                                            </div>,
                                            <div key="p2" className="flex items-center justify-center h-full">
                                                <span className="text-[8px] font-bold text-gray-600 leading-tight text-center px-1">
                                                    {project.tools[1] || ''}
                                                </span>
                                            </div>,
                                            <div key="p3" className="flex items-center justify-center h-full">
                                                <span className="text-[8px] font-bold text-gray-600 leading-tight text-center px-1">
                                                    {project.tools[2] || ''}
                                                </span>
                                            </div>,
                                        ]}
                                    />
                                </div>

                                {/* Project info */}
                                <div className="text-3xl mb-3">{project.icon}</div>
                                <h4 className="font-display font-bold text-lg text-text-primary mb-2 group-hover:text-primary-light transition-colors">
                                    {project.title}
                                </h4>
                                <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed mb-4">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {project.tools.map((tool) => (
                                        <span key={tool} className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary-light border border-primary/15">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-black font-semibold hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                        >
                            {content.viewAllProjects}
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-24 relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass rounded-3xl p-12 sm:p-16 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
                        <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
                            {content.ctaSectionTitlePrefix}{" "}
                            <span className="gradient-text">{content.ctaSectionTitleHighlight}</span>
                        </h2>
                        <p className="text-text-secondary text-lg mb-8 max-w-lg mx-auto">
                            {content.ctaSectionSubtitle}
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-black font-semibold text-lg hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                        >
                            {content.ctaSectionButton}
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
