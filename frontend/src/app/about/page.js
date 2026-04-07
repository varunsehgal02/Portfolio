"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo, skills, experience, education, certifications } from "@/data/personal";
import { aboutPageContent, aboutBentoCards as defaultAboutBentoCards } from "@/data/pageContent";
import { useEditableData } from "@/lib/useEditableData";

const Lanyard = dynamic(() => import("@/components/Lanyard/Lanyard"), { ssr: false });
const LightPillar = dynamic(() => import("@/components/LightPillar/LightPillar"), { ssr: false });
const ShinyText = dynamic(() => import("@/components/ShinyText/ShinyText"), { ssr: false });
const RotatingText = dynamic(() => import("@/components/RotatingText/RotatingText"), { ssr: false });
const MagicBento = dynamic(() => import("@/components/MagicBento/MagicBento"), { ssr: false });

/* ── animation helpers ── */
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
    }),
};

const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: (i = 0) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.15, duration: 0.6, type: "spring", stiffness: 120 },
    }),
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i = 0) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: i * 0.08, duration: 0.45, type: "spring", stiffness: 200 },
    }),
};

const popIn = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: (i = 0) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: i * 0.04, duration: 0.3 },
    }),
};

/* ── glassy card style reusable ── */
const glassCard = {
    background: "rgba(21, 21, 21, 0.82)",
    border: "1px solid rgba(42, 42, 42, 0.92)",
    backdropFilter: "blur(8px)",
};

const glassCardAccent = {
    ...glassCard,
    borderLeft: "3px solid rgba(230, 255, 0, 0.45)",
};

/* ── divider style ── */
const dividerGradient = "linear-gradient(to right, transparent, rgba(230, 255, 0, 0.3), transparent)";

// Auto-sliding image carousel component
const AutoSlideImages = () => {
    const images = [
        "/projects/saas-dashboard.png",
        "/projects/mobile-app.png",
        "/projects/social-media.png",
    ];
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIdx((prev) => (prev + 1) % images.length), 3000);
        return () => clearInterval(t);
    }, [images.length]);

    return (
            <div className="relative w-full h-full overflow-hidden rounded-xl bg-surface-light">
            <AnimatePresence mode="popLayout">
                <motion.img
                    key={idx}
                    src={images[idx]}
                    alt="Design showcase"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-text-primary">
                <h4 className="font-display font-bold text-lg">Visual Design</h4>
                <p className="text-text-secondary text-sm">UI/UX & Branding</p>
            </div>
        </div>
    );
};

// Auto-scrolling tools ticker
const ToolTicker = () => {
    const tools = [...skills["Design Tools"], "Wireframing", "Prototyping"];
    return (
        <div className="w-full h-full rounded-xl overflow-hidden flex flex-col justify-center relative bg-gradient-to-br from-[#151515] to-[#0a0a0a] border border-border">
            <h4 className="font-display font-bold text-lg text-text-primary mb-6 px-6 relative z-10">Toolkit</h4>
            <div className="relative overflow-hidden w-full flex select-none">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap gap-4 px-4"
                >
                    {[...tools, ...tools, ...tools].map((tool, i) => (
                        <div
                            key={i}
                            className="px-4 py-2 rounded-lg text-base font-medium glass"
                            style={{ color: "#E6FF00", border: "1px solid rgba(230, 255, 0, 0.18)" }}
                        >
                            {tool}
                        </div>
                    ))}
                </motion.div>
                {/* Fade edges */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#151515] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#151515] to-transparent z-10 pointer-events-none" />
            </div>
        </div>
    );
};

export default function AboutPage() {
    const personal = useEditableData("personal", personalInfo);
    const skillsData = useEditableData("skills", skills);
    const experienceData = useEditableData("experience", experience);
    const educationRaw = useEditableData("education", education);
    const educationData = Array.isArray(educationRaw) ? educationRaw : [educationRaw];
    const content = useEditableData("aboutContent", aboutPageContent);
    const aboutBentoCards = useEditableData("aboutBentoCards", defaultAboutBentoCards);

    const [idCardDataUrl, setIdCardDataUrl] = useState(null);

    useEffect(() => {
        const generateIDCard = async () => {
            if (typeof window === "undefined") return;
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1448; // ID Card ratio
            const ctx = canvas.getContext('2d');
            
            // Base background
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Neon accent border
            ctx.strokeStyle = '#E6FF00';
            ctx.lineWidth = 16;
            ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

            // Header Banner
            ctx.fillStyle = '#E6FF00';
            ctx.fillRect(32, 32, canvas.width - 64, 150);
            ctx.fillStyle = '#0a0a0a';
            ctx.font = '900 70px "Inter", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('PORTFOLIO ID', canvas.width / 2, 135);

            // Fetch and draw user image
            try {
                const img = new Image();
                img.src = '/varun.jpg';
                img.crossOrigin = 'anonymous';
                
                const loaded = await new Promise((resolve) => {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                });

                if (loaded) {
                    ctx.save();
                    // Outer neon circle
                    ctx.beginPath();
                    ctx.arc(canvas.width / 2, 480, 280, 0, Math.PI * 2);
                    ctx.fillStyle = '#E6FF00';
                    ctx.fill();
                    
                    // Image clipping mask
                    ctx.beginPath();
                    ctx.arc(canvas.width / 2, 480, 265, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    
                    const size = Math.min(img.width, img.height);
                    const sx = (img.width - size) / 2;
                    const sy = (img.height - size) / 2;
                    ctx.drawImage(img, sx, sy, size, size, canvas.width / 2 - 265, 480 - 265, 530, 530);
                    ctx.restore();
                }
            } catch (err) {}

            // User Info
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 80px "Inter", Arial, sans-serif';
            ctx.fillText(personal.name.toUpperCase(), canvas.width / 2, 920);

            let role = 'UI/UX | GRAPHIC DESIGNER';
            if (personal.title) {
                const parts = personal.title.split('|').map(s => s.trim());
                role = (parts[0] + (parts[1] ? ' | ' + parts[1] : '')).toUpperCase();
            }
            ctx.fillStyle = '#E6FF00';
            ctx.font = '700 45px "Inter", Arial, sans-serif';
            ctx.fillText(role, canvas.width / 2, 1010);

            // Skills
            ctx.fillStyle = '#aaaaaa';
            ctx.font = '600 35px "Inter", Arial, sans-serif';
            const allSkills = [...(skillsData["Design Tools"] || []), ...(skillsData["UI/UX"] || [])];
            ctx.fillText(allSkills.slice(0, 4).join(' • '), canvas.width / 2, 1100);
            if (allSkills.length > 4) {
                ctx.fillText(allSkills.slice(4, 7).join(' • '), canvas.width / 2, 1160);
            }

            // Bottom Barcode Area
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 36; i++) {
                const w = Math.random() * 12 + 3;
                ctx.fillRect(150 + i * 20, canvas.height - 200, w, 100);
            }

            setIdCardDataUrl(canvas.toDataURL('image/png'));
        };

        generateIDCard();
    }, [personal, skillsData]);

    return (
        <div className="relative" style={{ background: "#0a0a0a" }}>
            {/* ═══════ LIGHT PILLAR BACKGROUND ═══════ */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                <LightPillar
                    topColor="#E6FF00"
                    bottomColor="#5A6200"
                    intensity={0.5}
                    rotationSpeed={0.15}
                    glowAmount={0.0015}
                    pillarWidth={3}
                    pillarHeight={0.4}
                    noiseIntensity={0.4}
                    pillarRotation={25}
                    interactive={false}
                    mixBlendMode="screen"
                    quality="high"
                />
            </div>
            <div
                className="fixed inset-0 pointer-events-none"
                style={{ zIndex: 0, background: "rgba(10, 10, 10, 0.45)" }}
            />

            {/* ═══════ SECTION 1 — LANYARD ID CARD ═══════ */}
            <section className="relative" style={{ minHeight: "100vh", zIndex: 1 }}>
                <Lanyard position={[0, 0, 13]} gravity={[0, -40, 0]} fov={21} frontSrc={idCardDataUrl} backSrc={idCardDataUrl} />
                <div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    style={{ zIndex: 10 }}
                >
                    <span className="text-text-secondary text-sm font-medium animate-pulse">
                        {content.lanyardHint}
                    </span>
                    <svg
                        className="w-5 h-5 text-primary-light animate-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* ═══════ SECTION 2 — ABOUT ME ═══════ */}
            <section className="relative py-24 px-6" style={{ zIndex: 1 }}>
                <div className="max-w-4xl mx-auto">
                    {/* ── Hero: Name + Rotating Title ── */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="mb-16 text-center"
                    >
                        <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl leading-[1.18] pb-4 mb-4 overflow-visible">
                            <ShinyText
                                text={personal.name}
                                speed={3}
                                delay={0}
                                color="#a1a1aa"
                                shineColor="#e6ff00"
                                spread={120}
                                direction="left"
                                className="font-display font-bold block"
                            />
                        </h1>

                        <div className="flex items-center justify-center gap-3 text-2xl sm:text-3xl md:text-4xl font-display font-semibold text-text-secondary">
                            <span>I&apos;m a</span>
                            <RotatingText
                                texts={personal.rotatingRoles?.length ? personal.rotatingRoles : ["UI/UX Designer", "Graphic Designer", "Motion Graphics Artist"]}
                                mainClassName="px-3 py-1 bg-primary/20 text-primary-light overflow-hidden rounded-lg"
                                staggerFrom="last"
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "-120%" }}
                                staggerDuration={0.025}
                                splitLevelClassName="overflow-hidden pb-1"
                                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                rotationInterval={2500}
                            />
                        </div>

                        <p className="text-text-secondary text-xl leading-relaxed mt-8 max-w-2xl mx-auto">
                            {personal.summary}
                        </p>
                    </motion.div>

                    {/* ── Stats ── */}
                    <div className="flex flex-wrap justify-center gap-6 mb-16">
                        {personal.stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={scaleIn}
                                className="rounded-xl px-8 py-5 text-center transition-all duration-300 hover:scale-105"
                                style={glassCard}
                            >
                                <p className="text-primary-light font-bold text-3xl">{stat.value}</p>
                                <p className="text-text-muted text-sm mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="h-px w-full mb-16" style={{ background: dividerGradient }} />

                    {/* ── Experience ── */}
                    <div className="mb-16">
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeLeft}
                            className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-8 flex items-center gap-3"
                        >
                            <span className="text-3xl">💼</span> Experience
                        </motion.h2>

                        <div className="space-y-8">
                            {experienceData.map((exp, i) => (
                                <motion.div
                                    key={i}
                                    custom={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeLeft}
                                    className="relative rounded-xl p-6"
                                    style={glassCardAccent}
                                >
                                    <h3 className="font-display font-bold text-xl text-text-primary">{exp.role}</h3>
                                    <p className="text-primary-light text-base font-medium mt-1">
                                        {exp.company} · {exp.period}
                                    </p>
                                    <ul className="mt-3 space-y-2">
                                        {exp.highlights.map((h, j) => (
                                            <li
                                                key={j}
                                                className="text-text-secondary text-base leading-relaxed flex items-start gap-2"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                                {h}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="h-px w-full mb-16" style={{ background: dividerGradient }} />

                    {/* ── Education ── */}
                    <div className="mb-16">
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeLeft}
                            className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-8 flex items-center gap-3"
                        >
                            <span className="text-3xl">🎓</span> Education
                        </motion.h2>

                        <div className="space-y-6">
                            {educationData.map((edu, i) => (
                                <motion.div
                                    key={i}
                                    custom={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeLeft}
                                    className="relative rounded-xl p-6"
                                    style={glassCardAccent}
                                >
                                    <h3 className="font-display font-bold text-xl text-text-primary">{edu.degree}</h3>
                                    <p className="text-primary-light text-base font-medium mt-1">
                                        {edu.institution} · {edu.period}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="h-px w-full mb-16" style={{ background: dividerGradient }} />

                    {/* ── Skills & Tools ── */}
                    <div className="mb-16">
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeLeft}
                            className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-8 flex items-center gap-3"
                        >
                            <span className="text-3xl">🛠️</span> Skills &amp; Tools
                        </motion.h2>

                        <div className="space-y-6">
                            {Object.entries(skillsData).map(([category, items], catIdx) => (
                                <motion.div
                                    key={category}
                                    custom={catIdx}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeUp}
                                >
                                    <h3 className="font-display font-semibold text-base text-text-primary mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                        {category}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {items.map((skill, skillIdx) => (
                                            <motion.span
                                                key={skill}
                                                custom={catIdx * 4 + skillIdx}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true }}
                                                variants={popIn}
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                className="px-4 py-2 rounded-lg text-base font-medium cursor-default transition-colors duration-300 hover:bg-primary/20 hover:text-text-primary"
                                                style={{
                                                    background: "rgba(230, 255, 0, 0.08)",
                                                    border: "1px solid rgba(230, 255, 0, 0.15)",
                                                    color: "#E6FF00",
                                                }}
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════ SECTION 3 — SHOWCASE BENTO GRID ═══════ */}
            <section className="relative py-20 px-6" style={{ zIndex: 1 }}>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="max-w-6xl mx-auto mb-12"
                >
                    <h2 className="font-display font-bold text-4xl sm:text-5xl text-text-primary text-center flex items-center justify-center gap-3">
                        <span className="text-4xl drop-shadow-lg shadow-primary">✨</span> {content.sectionTitle}
                    </h2>
                    <p className="text-text-secondary text-center mt-4 text-lg max-w-2xl mx-auto">
                        {content.sectionSubtitle}
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto">
                    <MagicBento
                        cards={aboutBentoCards}
                        textAutoHide={true}
                        enableStars
                        enableSpotlight
                        enableBorderGlow={true}
                        enableTilt={false}
                        enableMagnetism={false}
                        clickEffect
                        spotlightRadius={400}
                        particleCount={12}
                        glowColor="132, 0, 255"
                        disableAnimations={false}
                    />
                </div>
            </section>

            <div className="h-20" />
        </div>
    );
}

