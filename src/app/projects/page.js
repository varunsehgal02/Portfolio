"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, categories } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import LiquidEther from "@/components/LiquidEther";

export default function ProjectsPage() {
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredProjects =
        activeCategory === "all"
            ? projects
            : projects.filter((p) => p.category === activeCategory);

    return (
        <div className="relative pt-28 pb-20">
            {/* LiquidEther Full Page Background */}
            <div className="fixed inset-0 z-0">
                <LiquidEther
                    colors={["#1E4BBD", "#3B6DE0", "#60A5FA"]}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>

            {/* Header */}
            <section className="relative z-[1] max-w-7xl mx-auto px-6 mb-16">
                <SectionHeading
                    title="My Projects"
                    subtitle="Explore my work across UI/UX design, graphic design, and motion graphics — each crafted with attention to detail and user-centered thinking."
                />

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                                ? "text-white"
                                : "text-text-secondary hover:text-text-primary glass"
                                }`}
                        >
                            {activeCategory === cat.id && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-secondary"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{cat.label}</span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Projects Grid */}
            <section className="relative z-[1] max-w-7xl mx-auto px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredProjects.map((project, i) => (
                            <ProjectCard key={project.id} project={project} index={i} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-text-muted text-lg">No projects in this category yet.</p>
                    </motion.div>
                )}
            </section>

            {/* Project Count */}
            <section className="relative z-[1] max-w-7xl mx-auto px-6 mt-16 text-center">
                <p className="text-text-muted text-sm">
                    Showing {filteredProjects.length} of {projects.length} projects
                </p>
            </section>
        </div>
    );
}
