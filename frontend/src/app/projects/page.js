"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { projects as defaultProjects } from "@/data/projects";
import { projectsPageContent } from "@/data/pageContent";
import { useEditableData } from "@/lib/useEditableData";
import ProjectCard from "@/components/ProjectCard";
import NetworkBackground from "@/components/NetworkBackground";

const Lanyard = dynamic(() => import("@/components/Lanyard/Lanyard"), { ssr: false });

const ID_CARDS_GALLERY = [
    { front: "/projects/real-id-cards/1-front.png?v=2", back: "/projects/real-id-cards/1-back.png?v=2", fitMode: "contain" },
    { front: "/projects/real-id-cards/2-front.png?v=2", back: "/projects/real-id-cards/2-back.png?v=2", fitMode: "contain" },
    { front: "/projects/real-id-cards/3-front.png?v=2", back: "/projects/real-id-cards/3-back.png?v=2", fitMode: "contain" },
    { front: "/projects/real-id-cards/4-front.png?v=2", back: "/projects/real-id-cards/4-back.png?v=2", fitMode: "contain" },
    { front: "/projects/omesh/1v.png?v=2", back: "/projects/omesh/2v.png?v=2", fitMode: "stretch" },
    { front: "/projects/omesh/3v.png?v=2", back: "/projects/omesh/4v.png?v=2", fitMode: "contain" },
    { front: "/projects/omesh/5v.png?v=2", back: "/projects/omesh/6v.png?v=2", fitMode: "stretch" },
    { front: "/projects/omesh/7v.png?v=2", back: "/projects/omesh/8v.png?v=2", fitMode: "stretch" },
    { front: "/projects/omesh/9v.png?v=2", back: "/projects/omesh/10v.png?v=2", fitMode: "stretch" },
    { front: "/projects/omesh/11v.png?v=2", back: "/projects/omesh/12v.png?v=2", fitMode: "stretch" },
    { front: "/projects/omesh/13v.png?v=2", back: "/projects/omesh/14v.png?v=2", fitMode: "stretch" },
    { front: "/projects/omesh/15v.png?v=2", back: "/projects/omesh/16v.png?v=2", fitMode: "stretch" },
];

export default function ProjectsPage() {
    const projectsDataRaw = useEditableData("projects", defaultProjects);
    const contentData = useEditableData("projectsContent", projectsPageContent);

    // Normalize projects
    const projectsData = useMemo(() => {
        const source = Array.isArray(projectsDataRaw) ? projectsDataRaw : [];
        const merged = [...source];
        defaultProjects.forEach((dp) => {
            if (!merged.some((p) => p?.id === dp.id)) merged.push(dp);
        });
        return merged.map(p => {
            // Apply subCategories if missing based on known IDs
            if (!p.subCategory) {
                if (p.id === "club-id-cards" || p.id === "college-event-merch") p.subCategory = "ID Card";
                if (p.id === "gaming-team-posters") p.subCategory = "Poster";
                if (p.id === "interviewai" || p.id === "visitrack") p.subCategory = "SaaS Dashboard";
                if (p.id === "cinepass" || p.id === "expensify") p.subCategory = "Mobile App";
            }
            return p;
        });
    }, [projectsDataRaw]);

    const [mainCategory, setMainCategory] = useState(null);
    const [subCategory, setSubCategory] = useState("All");

    const [selectedProject, setSelectedProject] = useState(null);
    const [activeModalImage, setActiveModalImage] = useState(0);
    const [slideDirection, setSlideDirection] = useState(1);

    const availableSubCategories = useMemo(() => {
        if (!mainCategory) return ["All"];
        const cats = projectsData
            .filter((p) => p.category === mainCategory && p.subCategory)
            .map((p) => p.subCategory);
        const uniqueCats = ["All", ...new Set(cats)];
        if (mainCategory === "graphic") {
            uniqueCats.push("Logo (Coming Soon)");
        }
        return uniqueCats;
    }, [mainCategory, projectsData]);

    const filteredProjects = useMemo(() => {
        if (!mainCategory) return [];
        let pList = projectsData.filter((p) => p.category === mainCategory);
        if (subCategory !== "All") {
            pList = pList.filter((p) => p.subCategory === subCategory);
        }
        return pList;
    }, [mainCategory, subCategory, projectsData]);

    const [uiuxBg, setUiuxBg] = useState("/projects/saas-dashboard.png");
    const [graphicBg, setGraphicBg] = useState("/projects/social-media.png");

    useEffect(() => {
        if (projectsData && projectsData.length > 0) {
            const uiuxProjs = projectsData.filter(p => p.category === 'uiux' && p.image);
            const graphicProjs = projectsData.filter(p => p.category === 'graphic' && p.image);
            
            if (uiuxProjs.length > 0) {
                setUiuxBg(uiuxProjs[Math.floor(Math.random() * uiuxProjs.length)].image);
            }
            if (graphicProjs.length > 0) {
                setGraphicBg(graphicProjs[Math.floor(Math.random() * graphicProjs.length)].image);
            }
        }
    }, [projectsData]);

    const categoryOptions = [
        { id: "uiux", title: "UI/UX", desc: "Digital Experiences & Interfaces", bg: uiuxBg, icon: "🌐" },
        { id: "graphic", title: "Graphic Designer", desc: "Branding, Posters & ID Cards", bg: graphicBg, icon: "🎨" }
    ];

    // ----- Modal Logic -----
    function getProjectGallery(project) {
        const gallery = Array.isArray(project?.gallery) ? project.gallery.filter(Boolean) : [];
        const base = project?.image ? [project.image] : [];
        if (gallery.length > 0) {
            return [...new Set([...gallery, ...base])];
        }
        return [...new Set([...base])];
    }

    const openProjectModal = (project) => {
        setSelectedProject(project);
        setActiveModalImage(0);
        setSlideDirection(1);
    };

    const modalGallery = selectedProject ? getProjectGallery(selectedProject) : [];
    const modalImageClass = "block w-full h-full object-contain bg-black/40 p-4";

    const navigateModalImage = useCallback((direction) => {
        if (modalGallery.length <= 1) return;
        setSlideDirection(direction);
        setActiveModalImage((prev) => (prev + direction + modalGallery.length) % modalGallery.length);
    }, [modalGallery.length]);

    const selectModalImage = useCallback((nextIndex) => {
        if (nextIndex === activeModalImage) return;
        setSlideDirection(nextIndex > activeModalImage ? 1 : -1);
        setActiveModalImage(nextIndex);
    }, [activeModalImage]);

    useEffect(() => {
        if (!selectedProject || modalGallery.length <= 1) return;
        const handleKeyDown = (event) => {
            if (event.key === "ArrowRight") {
                event.preventDefault(); navigateModalImage(1);
            } else if (event.key === "ArrowLeft") {
                event.preventDefault(); navigateModalImage(-1);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedProject, modalGallery.length, navigateModalImage]);

    return (
        <div className="relative min-h-screen pt-28 pb-20">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <NetworkBackground className="opacity-95" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <AnimatePresence mode="wait">
                    {!mainCategory ? (
                        <motion.div
                            key="main-selection"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center justify-center min-h-[65vh]"
                        >
                            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-text-primary mb-6 text-center">
                                Choose a <span className="gradient-text">Discipline</span>
                            </h1>
                            <p className="text-text-secondary text-lg mb-16 text-center max-w-2xl">
                                Explore my specialized portfolios across different creative domains.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                                {categoryOptions.map((opt, idx) => (
                                    <motion.button
                                        key={opt.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                        whileHover={!opt.comingSoon ? { scale: 1.02, y: -5 } : {}}
                                        whileTap={!opt.comingSoon ? { scale: 0.98 } : {}}
                                        onClick={() => {
                                            if (!opt.comingSoon) {
                                                setMainCategory(opt.id);
                                                setSubCategory("All");
                                            }
                                        }}
                                        className={`relative group rounded-3xl overflow-hidden glass border h-[420px] flex flex-col justify-end p-8 text-left transition-all duration-500 ${
                                            opt.comingSoon 
                                                ? 'opacity-60 cursor-not-allowed border-white/5' 
                                                : 'border-primary/20 hover:border-primary cursor-pointer hover:shadow-[0_0_50px_rgba(230,255,0,0.2)]'
                                        }`}
                                    >
                                        <div className="absolute inset-0 z-0">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-[#0a0a0a]/80 to-transparent z-10" />
                                            {/* decorative background representation, can be a solid stylish bg if image missing */}
                                            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-center bg-cover" style={{ backgroundImage: `url(${opt.bg})` }} />
                                        </div>
                                        
                                        <div className="relative z-20">
                                            <div className="text-5xl mb-5 transform group-hover:scale-110 transition-transform origin-bottom-left duration-500">
                                                {opt.icon}
                                            </div>
                                            <h2 className="font-display font-bold text-3xl text-white mb-2 leading-tight">
                                                {opt.title}
                                            </h2>
                                            <p className="text-gray-400 text-sm">{opt.desc}</p>
                                            
                                            {opt.comingSoon && (
                                                <div className="mt-6 inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wider uppercase">
                                                    Coming Soon
                                                </div>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="category-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Header / Back / Filter */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 bg-black/40 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setMainCategory(null)}
                                        className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/10 hover:border-primary/50 transition-all text-white"
                                        title="Back to disciplines"
                                    >
                                        ←
                                    </button>
                                    <div>
                                        <h2 className="font-display font-bold text-2xl text-white">
                                            {categoryOptions.find(c => c.id === mainCategory)?.title}
                                        </h2>
                                        <p className="text-primary-light text-sm mt-1">
                                            {filteredProjects.length} Projects found
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <span className="text-sm font-medium text-text-muted">Filter by:</span>
                                    <div className="relative flex-1 md:w-56">
                                        <select
                                            value={subCategory}
                                            onChange={(e) => setSubCategory(e.target.value)}
                                            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-colors hover:border-white/20"
                                        >
                                            {availableSubCategories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-xs">
                                            ▼
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Content */}
                            {mainCategory === "graphic" && subCategory === "ID Card" ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative w-full h-[80vh] min-h-[600px] bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 overflow-y-auto overflow-x-hidden custom-scrollbar"
                                >
                                    <div className="text-center w-full z-10 pointer-events-none px-4 pt-10 pb-12 shrink-0">
                                        <h3 className="font-display text-2xl md:text-3xl font-semibold text-white tracking-wide">Premium Identity Cards</h3>
                                        <p className="text-primary-light text-sm mt-2 font-medium">Interactive 3D Preview (Drag to swing)</p>
                                    </div>
                                    
                                    <div className="w-full flex flex-wrap justify-center gap-y-12 md:gap-y-24 pointer-events-auto pb-24 px-8 pt-8">
                                        {ID_CARDS_GALLERY.map((card, i) => (
                                            <div key={i} className="w-full md:w-1/3 h-[500px] md:h-[700px] flex justify-center z-10 relative">
                                                <div className="w-full max-w-[380px] h-full">
                                                    <Lanyard frontSrc={card.front} backSrc={card.back} fitMode={card.fitMode || "stretch"} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={subCategory}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                    >
                                        {filteredProjects.length > 0 ? (
                                            filteredProjects.map((project, i) => (
                                                <ProjectCard
                                                    key={project.id}
                                                    project={project}
                                                    index={i}
                                                    onOpen={openProjectModal}
                                                />
                                            ))
                                        ) : (
                                            <div className="col-span-full py-32 flex flex-col items-center text-center">
                                                <div className="text-6xl mb-4 opacity-50">📂</div>
                                                <h3 className="text-xl text-white font-medium mb-2">No projects found</h3>
                                                <p className="text-text-muted text-sm max-w-md">Try selecting a different subcategory or check back later for new updates.</p>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Project Modal View */}
                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8"
                            onClick={() => setSelectedProject(null)}
                        >
                            <motion.div
                                initial={{ y: 30, opacity: 0, scale: 0.95 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="w-full max-w-6xl h-[min(88vh,760px)] rounded-3xl border border-primary/20 overflow-hidden bg-[#0c0c0c] shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
                                    <div className="flex flex-col bg-black min-h-[320px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
                                        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                                            {modalGallery[activeModalImage] ? (
                                                <AnimatePresence mode="wait" initial={false}>
                                                    <motion.img
                                                        key={`${modalGallery[activeModalImage]}-${activeModalImage}`}
                                                        src={modalGallery[activeModalImage]}
                                                        alt={`${selectedProject.title} preview ${activeModalImage + 1}`}
                                                        className={modalImageClass}
                                                        loading="eager"
                                                        decoding="async"
                                                        fetchPriority="high"
                                                        initial={{ opacity: 0, x: slideDirection * 40, scale: 0.98 }}
                                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                                        exit={{ opacity: 0, x: slideDirection * -40, scale: 0.98 }}
                                                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                                    />
                                                </AnimatePresence>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-7xl">{selectedProject.icon}</div>
                                            )}
                                            {modalGallery.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={() => navigateModalImage(-1)}
                                                        className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-black/60 text-white hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-md"
                                                        aria-label="Previous image"
                                                    >
                                                        &lt;
                                                    </button>
                                                    <button
                                                        onClick={() => navigateModalImage(1)}
                                                        className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-black/60 text-white hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-md"
                                                        aria-label="Next image"
                                                    >
                                                        &gt;
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        {modalGallery.length > 1 && (
                                            <div className="flex-none p-4 flex gap-3 overflow-x-auto custom-scrollbar bg-[#080808] border-t border-white/10">
                                                {modalGallery.map((item, i) => (
                                                    <button
                                                        key={`${item}-${i}`}
                                                        onClick={() => selectModalImage(i)}
                                                        className={`w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeModalImage === i ? "border-primary shadow-[0_0_15px_rgba(230,255,0,0.3)]" : "border-transparent opacity-60 hover:opacity-100"}`}
                                                    >
                                                        <img
                                                            src={item}
                                                            alt={`thumb ${i + 1}`}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative p-6 sm:p-8 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#111] to-[#080808] min-h-0">
                                        <button
                                            onClick={() => setSelectedProject(null)}
                                            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all"
                                            aria-label="Close"
                                        >
                                            ✕
                                        </button>

                                        <div className="pr-14">
                                            <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-md border border-primary/30 bg-primary/10 text-primary-light uppercase tracking-wider">
                                                {selectedProject.subCategory || selectedProject.category}
                                            </div>
                                            <h3 className="text-3xl sm:text-4xl font-display text-white font-bold mb-4 leading-tight">{selectedProject.title}</h3>
                                            <p className="text-text-secondary mb-6 leading-relaxed text-lg">{selectedProject.description}</p>
                                        </div>

                                        {selectedProject.video ? (
                                            <div className="rounded-2xl overflow-hidden border border-white/10 mb-6 shadow-xl">
                                                <video
                                                    src={selectedProject.video}
                                                    controls
                                                    className="w-full h-[240px] object-cover"
                                                />
                                            </div>
                                        ) : null}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                            {(Array.isArray(selectedProject.highlights) ? selectedProject.highlights : []).map((h) => (
                                                <div key={h} className="text-sm text-text-secondary bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                                                    <span className="text-primary">✦</span> {h}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {(Array.isArray(selectedProject.tools) ? selectedProject.tools : []).map((tool) => (
                                                <span key={tool} className="px-4 py-1.5 rounded-full text-xs font-medium bg-white/5 text-white border border-white/10 hover:border-primary/50 transition-colors cursor-default">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>

                                        {selectedProject.caseStudy && (
                                            <div className="mb-8 pt-8 border-t border-white/10">
                                                <h4 className="text-2xl font-display text-white font-bold mb-6">Case Study</h4>
                                                
                                                {selectedProject.caseStudy.vision && (
                                                    <div className="mb-6">
                                                        <h5 className="text-primary font-medium mb-2 uppercase tracking-wider text-sm">Vision</h5>
                                                        <p className="text-text-secondary leading-relaxed">{selectedProject.caseStudy.vision}</p>
                                                    </div>
                                                )}
                                                
                                                {selectedProject.caseStudy.challenges && selectedProject.caseStudy.challenges.length > 0 && (
                                                    <div className="mb-6">
                                                        <h5 className="text-primary font-medium mb-3 uppercase tracking-wider text-sm">Key Challenges</h5>
                                                        <ul className="space-y-3">
                                                            {selectedProject.caseStudy.challenges.map((challenge, idx) => (
                                                                <li key={idx} className="flex items-start gap-3 text-text-secondary">
                                                                    <span className="text-white/30 mt-1">▹</span>
                                                                    <span className="leading-relaxed">{challenge}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {selectedProject.caseStudy.designSystem && (
                                                    <div className="mb-6">
                                                        <h5 className="text-primary font-medium mb-3 uppercase tracking-wider text-sm">Design System</h5>
                                                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
                                                            {selectedProject.caseStudy.designSystem.colors && (
                                                                <div className="flex flex-col sm:flex-row sm:gap-2">
                                                                    <span className="text-white font-medium min-w-[100px]">Colors: </span>
                                                                    <span className="text-text-secondary">{selectedProject.caseStudy.designSystem.colors.primary}, {selectedProject.caseStudy.designSystem.colors.secondary || selectedProject.caseStudy.designSystem.colors.accents}</span>
                                                                </div>
                                                            )}
                                                            {selectedProject.caseStudy.designSystem.typography && (
                                                                <div className="flex flex-col sm:flex-row sm:gap-2">
                                                                    <span className="text-white font-medium min-w-[100px]">Typography: </span>
                                                                    <span className="text-text-secondary">{selectedProject.caseStudy.designSystem.typography}</span>
                                                                </div>
                                                            )}
                                                            {selectedProject.caseStudy.designSystem.style && (
                                                                <div className="flex flex-col sm:flex-row sm:gap-2">
                                                                    <span className="text-white font-medium min-w-[100px]">Style: </span>
                                                                    <span className="text-text-secondary">{selectedProject.caseStudy.designSystem.style}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedProject.caseStudy.features && selectedProject.caseStudy.features.length > 0 && (
                                                    <div className="mb-6">
                                                        <h5 className="text-primary font-medium mb-3 uppercase tracking-wider text-sm">Core Features</h5>
                                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {selectedProject.caseStudy.features.map((feature, idx) => (
                                                                <li key={idx} className="flex items-center gap-3 text-text-secondary bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                                                                    <span className="text-primary">✓</span>
                                                                    <span className="text-sm">{feature}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {(selectedProject.link !== "") && (
                                            <div className="mt-8 pt-6 border-t border-white/10">
                                                <a
                                                    href={selectedProject.link.startsWith('http') ? selectedProject.link : `https://${selectedProject.link}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-lg font-bold hover:shadow-[0_0_30px_rgba(230,255,0,0.3)] transition-all transform hover:-translate-y-1"
                                                >
                                                    View Project ↗
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
