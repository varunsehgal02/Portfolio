"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { projects, categories } from "@/data/projects";
import { projectsPageContent } from "@/data/pageContent";
import { useEditableData } from "@/lib/useEditableData";
import ProjectCard from "@/components/ProjectCard";
import NetworkBackground from "@/components/NetworkBackground";

const GradualBlur = dynamic(() => import("@/components/GradualBlur/GradualBlur"), { ssr: false });
const FluidGlass = dynamic(() => import("@/components/FluidGlass/FluidGlass"), { ssr: false });

export default function ProjectsPage() {
    const projectsData = useEditableData("projects", projects);
    const categoriesData = useEditableData("projectCategories", categories);
    const content = useEditableData("projectsContent", projectsPageContent);
    const requiredClubGallery = useMemo(
        () => [
            "/projects/xlnc-1.png",
            "/projects/xlnc-2.png",
            "/projects/xlnc-3.png",
            "/projects/xlnc-4.png",
            "/projects/xlnc-5.png",
            "/projects/xlnc-7.png",
            "/projects/xlnc-8.png",
            "/projects/xlnc-9.png",
        ],
        []
    );
    const normalizedProjectsData = useMemo(
        () =>
            (Array.isArray(projectsData) ? projectsData : []).map((project) => {
                if (project?.id !== "club-id-cards") return project;

                const currentGallery = Array.isArray(project.gallery) ? project.gallery.filter(Boolean) : [];
                const fullGallery = [...new Set([...requiredClubGallery, ...currentGallery])];

                return {
                    ...project,
                    coverFit: "contain",
                    image: project.image || "/projects/xlnc-7.png",
                    gallery: fullGallery,
                };
            }),
        [projectsData, requiredClubGallery]
    );

    const [activeCategory, setActiveCategory] = useState("all");
    const [activeRevealCategory, setActiveRevealCategory] = useState("uiux");
    const [activeBestCategory, setActiveBestCategory] = useState("uiux");
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeModalImage, setActiveModalImage] = useState(0);
    const [slideDirection, setSlideDirection] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const revealImgRef = useRef(null);

    useEffect(() => {
        const syncViewport = () => setIsMobile(window.innerWidth < 768);
        syncViewport();
        window.addEventListener("resize", syncViewport);
        return () => window.removeEventListener("resize", syncViewport);
    }, []);

    useEffect(() => {
        if (activeCategory === "uiux" || activeCategory === "graphic" || activeCategory === "motion") {
            setActiveBestCategory(activeCategory);
        }
    }, [activeCategory]);

    const filteredProjects =
        activeCategory === "all"
            ? normalizedProjectsData
            : normalizedProjectsData.filter((p) => p.category === activeCategory);

    const revealByCategory = useMemo(() => {
        const uiux = normalizedProjectsData.find((p) => p.category === "uiux" && p.image)?.image || "/projects/saas-dashboard.png";
        const graphic = normalizedProjectsData.find((p) => p.category === "graphic" && p.image)?.image || "/projects/social-media.png";
        const motion = normalizedProjectsData.find((p) => p.category === "motion" && p.image)?.image || "/projects/mobile-app.png";

        return {
            uiux,
            graphic,
            motion,
        };
    }, [normalizedProjectsData]);

    const revealImage = revealByCategory[activeRevealCategory];
    const bestByCategory = useMemo(
        () => ({
            uiux: normalizedProjectsData.find((p) => p.category === "uiux") || normalizedProjectsData[0],
            graphic: normalizedProjectsData.find((p) => p.category === "graphic") || normalizedProjectsData[0],
            motion: normalizedProjectsData.find((p) => p.category === "motion") || normalizedProjectsData[0],
        }),
        [normalizedProjectsData]
    );
    const featuredProject = bestByCategory[activeBestCategory] || normalizedProjectsData[0];
    const featuredImageFit = featuredProject?.coverFit === "contain" ? "object-contain bg-black/55 p-3" : "object-cover";

    const revealThumbs = [
        { id: "uiux", label: "UI/UX", image: revealByCategory.uiux },
        { id: "graphic", label: "Graphic", image: revealByCategory.graphic },
        { id: "motion", label: "Motion", image: revealByCategory.motion },
    ];

    const getProjectGallery = (project) => {
        const categoryFallback = {
            uiux: ["/projects/saas-dashboard.png", "/projects/mobile-app.png"],
            graphic: ["/projects/social-media.png", "/projects/saas-dashboard.png"],
            motion: ["/projects/mobile-app.png", "/projects/social-media.png"],
        };

        const gallery = Array.isArray(project?.gallery) ? project.gallery.filter(Boolean) : [];
        const base = project?.image ? [project.image] : [];
        if (gallery.length > 0) {
            return [...new Set([...gallery, ...base])];
        }
        const fallbacks = categoryFallback[project?.category] || [];
        const merged = [...gallery, ...base, ...fallbacks];
        return [...new Set(merged)];
    };

    const normalizedSelectedProjectLink = selectedProject?.link
        ? (selectedProject.link.startsWith("http://") || selectedProject.link.startsWith("https://") || selectedProject.link.startsWith("/")
            ? selectedProject.link
            : `https://${selectedProject.link}`)
        : "";

    const openProjectModal = (project) => {
        setSelectedProject(project);
        setActiveModalImage(0);
        setSlideDirection(1);
    };

    const modalGallery = selectedProject ? getProjectGallery(selectedProject) : [];
    const modalImageClass = selectedProject?.coverFit === "contain"
        ? "w-full h-full object-contain bg-black p-2"
        : "w-full h-full object-cover";

    const navigateModalImage = useCallback(
        (direction) => {
            if (modalGallery.length <= 1) return;
            setSlideDirection(direction);
            setActiveModalImage((prev) => (prev + direction + modalGallery.length) % modalGallery.length);
        },
        [modalGallery.length]
    );

    const selectModalImage = useCallback(
        (nextIndex) => {
            if (nextIndex === activeModalImage) return;
            setSlideDirection(nextIndex > activeModalImage ? 1 : -1);
            setActiveModalImage(nextIndex);
        },
        [activeModalImage]
    );

    useEffect(() => {
        if (!selectedProject || modalGallery.length <= 1) return;

        const handleKeyDown = (event) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                navigateModalImage(1);
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                navigateModalImage(-1);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedProject, modalGallery.length, navigateModalImage]);

    return (
        <div className="relative pt-0 pb-20">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <NetworkBackground className="opacity-95" />
            </div>

            <section
                className="relative overflow-hidden"
                style={{ height: "80vh", backgroundColor: "transparent" }}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const el = revealImgRef.current;
                    if (el) {
                        el.style.setProperty("--mx", `${x}px`);
                        el.style.setProperty("--my", `${y + rect.height * 0.42}px`);
                    }
                }}
                onMouseLeave={() => {
                    const el = revealImgRef.current;
                    if (el) {
                        el.style.setProperty("--mx", "-9999px");
                        el.style.setProperty("--my", "-9999px");
                    }
                }}
            >
                <div className="absolute inset-0 z-[4] pointer-events-none bg-gradient-to-b from-black/20 via-black/30 to-black/45" />

                <div
                    className="absolute flex flex-col items-center justify-center text-center px-8 rounded-3xl border border-border backdrop-blur-md"
                    style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "86%",
                        maxWidth: "900px",
                        zIndex: 6,
                        background: "linear-gradient(135deg, rgba(21, 21, 21, 0.92), rgba(10, 10, 10, 0.82))",
                        boxShadow: "0 12px 60px rgba(0, 0, 0, 0.45)",
                        paddingTop: "2.5rem",
                        paddingBottom: "2.5rem",
                    }}
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-text-primary mb-4"
                        style={{ textShadow: "0 8px 24px rgba(0, 0, 0, 0.65)" }}
                    >
                        {content.heroTitlePrefix} <span className="gradient-text">{content.heroTitleHighlight}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-text-secondary text-lg md:text-xl max-w-2xl"
                    >
                        {content.heroSubtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        className="flex gap-4 mt-8"
                    >
                        {revealThumbs.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveRevealCategory(item.id)}
                                onMouseEnter={() => setActiveRevealCategory(item.id)}
                                className={`group relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${activeRevealCategory === item.id
                                    ? "border-primary shadow-[0_0_24px_rgba(230,255,0,0.28)]"
                                    : "border-border hover:border-primary/60"
                                    }`}
                                aria-label={`Show ${item.label} reveal`}
                            >
                                <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/10 transition-colors" />
                            </button>
                        ))}
                    </motion.div>
                </div>

                <img
                    ref={revealImgRef}
                    src={revealImage}
                    alt="Project reveal"
                    style={{
                        position: "absolute",
                        width: "100%",
                        top: "-50%",
                        zIndex: 5,
                        mixBlendMode: "lighten",
                        opacity: 0.24,
                        pointerEvents: "none",
                        "--mx": "-9999px",
                        "--my": "-9999px",
                        WebkitMaskImage:
                            "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 75px, rgba(255,255,255,0.65) 145px, rgba(255,255,255,0.28) 220px, rgba(255,255,255,0) 300px)",
                        maskImage:
                            "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 75px, rgba(255,255,255,0.65) 145px, rgba(255,255,255,0.28) 220px, rgba(255,255,255,0) 300px)",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                    }}
                />
            </section>

            <section className="relative z-[1] max-w-7xl mx-auto px-6 mt-16 mb-10">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {categoriesData.map((cat) => (
                        <motion.button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                                ? "text-black"
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

            <section className="relative z-[1] max-w-7xl mx-auto px-6 mb-12 py-8">
                <FluidGlass style={{ height: "600px" }}>
                    <div className="absolute inset-0 pointer-events-none opacity-70">
                        <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-primary/16 blur-3xl" />
                        <div className="absolute bottom-8 right-8 w-64 h-64 rounded-full bg-secondary/16 blur-3xl" />
                        <div className="absolute inset-x-12 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                    </div>

                    <div
                        className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 h-full items-center cursor-pointer"
                        onClick={() => openProjectModal(featuredProject)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                openProjectModal(featuredProject);
                            }
                        }}
                    >
                        <div className="relative z-10">
                            <p className="text-primary-light text-sm uppercase tracking-[0.22em] mb-2">✨ Best Project</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {[
                                    { id: "uiux", label: "UI/UX" },
                                    { id: "graphic", label: "Graphic Design" },
                                    { id: "motion", label: "Motion Art" },
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveBestCategory(opt.id);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm border transition-all duration-300 ${activeBestCategory === opt.id
                                            ? "border-primary bg-primary/15 text-text-primary shadow-[0_0_18px_rgba(230,255,0,0.25)]"
                                            : "border-border bg-surface-light/70 text-text-secondary hover:border-primary/50"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            <h2 className="font-display text-3xl sm:text-4xl text-text-primary font-bold mb-4">
                                {featuredProject.title}
                            </h2>
                            <p className="text-text-secondary leading-relaxed mb-5">{featuredProject.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {featuredProject.tools.map((tool) => (
                                    <span key={tool} className="px-3 py-1 text-xs rounded-lg border border-primary/20 bg-primary/10 text-primary-light">
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="relative rounded-xl overflow-hidden border border-primary/20 h-80 bg-background/80 backdrop-blur-md group shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(230,255,0,0.18),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(196,219,0,0.18),transparent_45%)]" />
                            {featuredProject.image ? (
                                <img src={featuredProject.image} alt={featuredProject.title} className={`w-full h-full ${featuredImageFit} scale-105 group-hover:scale-110 transition-transform duration-700`} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-7xl">{featuredProject.icon}</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs bg-black/45 border border-primary/30 text-primary-light">
                                {content.featuredPrefix} {activeBestCategory === "uiux" ? "UI/UX" : activeBestCategory === "graphic" ? "Graphic" : "Motion"}
                            </div>
                        </div>
                    </div>
                </FluidGlass>
            </section>

            <section className="relative z-[1] max-w-7xl mx-auto px-6" style={{ position: "relative" }}>
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
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={i}
                                onOpen={openProjectModal}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm p-4 sm:p-8"
                            onClick={() => setSelectedProject(null)}
                        >
                            <motion.div
                                initial={{ y: 30, opacity: 0, scale: 0.98 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 24, opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.25 }}
                                className="max-w-5xl mx-auto h-full max-h-[90vh] rounded-2xl border border-primary/20 overflow-hidden bg-[#111111] shadow-[0_28px_80px_rgba(0,0,0,0.5)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="h-full grid grid-cols-1 lg:grid-cols-2">
                                    <div className="relative bg-[#0c0c0c] min-h-[260px] border-r border-border/80">
                                        {modalGallery[activeModalImage] ? (
                                            <AnimatePresence mode="wait" initial={false}>
                                                <motion.img
                                                    key={`${modalGallery[activeModalImage]}-${activeModalImage}`}
                                                    src={modalGallery[activeModalImage]}
                                                    alt={`${selectedProject.title} preview ${activeModalImage + 1}`}
                                                    className={modalImageClass}
                                                    initial={{ opacity: 0, x: slideDirection * 42, scale: 0.985 }}
                                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                                    exit={{ opacity: 0, x: slideDirection * -42, scale: 0.985 }}
                                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                                />
                                            </AnimatePresence>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-7xl">{selectedProject.icon}</div>
                                        )}
                                        {modalGallery.length > 1 && (
                                            <>
                                                <button
                                                    onClick={() => navigateModalImage(-1)}
                                                    className="absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 rounded-full border border-primary/30 bg-black/55 text-primary-light hover:bg-black/75 transition-colors"
                                                    aria-label="Previous image"
                                                >
                                                    &lt;
                                                </button>
                                                <button
                                                    onClick={() => navigateModalImage(1)}
                                                    className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 rounded-full border border-primary/30 bg-black/55 text-primary-light hover:bg-black/75 transition-colors"
                                                    aria-label="Next image"
                                                >
                                                    &gt;
                                                </button>
                                            </>
                                        )}
                                        <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto pb-1 pr-1">
                                            {modalGallery.map((item, i) => (
                                                <button
                                                    key={`${item}-${i}`}
                                                    onClick={() => selectModalImage(i)}
                                                    className={`w-16 h-12 shrink-0 rounded-md overflow-hidden border ${activeModalImage === i ? "border-primary shadow-[0_0_0_1px_rgba(230,255,0,0.25)]" : "border-border"}`}
                                                >
                                                    <img src={item} alt={`thumb ${i + 1}`} className={selectedProject?.coverFit === "contain" ? "w-full h-full object-contain bg-black/60" : "w-full h-full object-cover"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-5 sm:p-6 overflow-y-auto bg-[linear-gradient(180deg,#151515_0%,#101010_100%)]">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <h3 className="text-2xl sm:text-3xl font-display text-text-primary font-bold">{selectedProject.title}</h3>
                                            <button
                                                onClick={() => setSelectedProject(null)}
                                                className="w-9 h-9 rounded-lg border border-primary/20 bg-surface-light/60 text-text-primary hover:bg-primary/10 hover:border-primary/40 transition-colors"
                                                aria-label="Close"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <p className="text-text-secondary mb-4">{selectedProject.description}</p>

                                        {selectedProject.video ? (
                                            <div className="rounded-xl overflow-hidden border border-primary/20 bg-background mb-4 shadow-[0_12px_32px_rgba(0,0,0,0.24)]">
                                                <video
                                                    src={selectedProject.video}
                                                    controls
                                                    className="w-full h-[220px] object-cover"
                                                />
                                            </div>
                                        ) : null}

                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedProject.highlights.map((h) => (
                                                <div key={h} className="text-sm text-text-secondary bg-surface-light/70 border border-primary/15 rounded-lg px-3 py-2">
                                                    {h}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {selectedProject.tools.map((tool) => (
                                                <span key={tool} className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary-light border border-primary/20">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>

                                        {normalizedSelectedProjectLink && (
                                            <div className="mt-5">
                                                <a
                                                    href={normalizedSelectedProjectLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold"
                                                >
                                                    Open Project Link
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isMobile && (
                    <GradualBlur
                        target="parent"
                        position="bottom"
                        height="7rem"
                        strength={2}
                        divCount={5}
                        curve="bezier"
                        exponential
                        opacity={1}
                    />
                )}

                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-text-muted text-lg">{content.emptyCategoryText}</p>
                    </motion.div>
                )}
            </section>

            <section className="relative z-[1] max-w-7xl mx-auto px-6 mt-16 text-center">
                <p className="text-text-muted text-sm">
                    Showing {filteredProjects.length} of {normalizedProjectsData.length} projects
                </p>
            </section>
        </div>
    );
}
