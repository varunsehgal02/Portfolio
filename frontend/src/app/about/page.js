"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo, skills, experience, education, certifications } from "@/data/personal";
import { aboutPageContent, aboutBentoCards as defaultAboutBentoCards } from "@/data/pageContent";
import { useEditableData } from "@/lib/useEditableData";

const Lanyard = dynamic(() => import("@/components/Lanyard/Lanyard"), { ssr: false });
import Squares from "@/components/Squares";
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
    const [backCardDataUrl, setBackCardDataUrl] = useState(null);

    useEffect(() => {
        const generateIDCard = async () => {
            if (typeof window === "undefined") return;
            const canvas = document.createElement('canvas');
            const cardW = 1000;
            const cardH = 1414; // ID Card ratio
            canvas.width = cardW;
            canvas.height = cardH;
            const ctx = canvas.getContext('2d');
            
            // Base background (sleek dark matte finish)
            ctx.fillStyle = '#0f0f11';
            ctx.fillRect(0, 0, cardW, cardH);
            
            // Premium glowing top gradient using brand primary
            const grad = ctx.createLinearGradient(0, 0, 0, 500);
            grad.addColorStop(0, 'rgba(230, 255, 0, 0.12)'); // Subtle neon glow
            grad.addColorStop(1, 'rgba(15, 15, 17, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, cardW, 500);

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
                    const arcX = cardW / 2;
                    const arcY = 400; // Shifted up
                    
                    // Elliptical mask to actively counter the 3D model's vertical stretch UV projection
                    const radiusX = 270;
                    const radiusY = 195;

                    // Delicate outer glow/ring for profile picture
                    ctx.beginPath();
                    ctx.ellipse(arcX, arcY, radiusX + 10, radiusY + 7, 0, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
                    ctx.fill();

                    // Image clipping mask
                    ctx.beginPath();
                    ctx.ellipse(arcX, arcY, radiusX, radiusY, 0, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    
                    const srcW = img.width;
                    const srcH = img.height;
                    const size = Math.min(srcW, srcH);
                    const sx = (srcW - size) / 2;
                    const sy = (srcH - size) / 2;
                    
                    ctx.drawImage(img, sx, sy, size, size, arcX - radiusX, arcY - radiusY, radiusX * 2, radiusY * 2);
                    ctx.restore();

                    // Professional sleek ring border
                    ctx.beginPath();
                    ctx.ellipse(arcX, arcY, radiusX, radiusY, 0, 0, Math.PI * 2);
                    ctx.strokeStyle = '#E6FF00';
                    ctx.lineWidth = 6; // Thinner for elegance
                    ctx.stroke();
                }
            } catch (err) {}

            // Professional Divider Line under profile
            ctx.beginPath();
            ctx.moveTo(cardW / 2 - 120, 650);
            ctx.lineTo(cardW / 2 + 120, 650);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Name
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 64px "Inter", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.letterSpacing = "4px";
            ctx.fillText(personal.name.toUpperCase(), cardW / 2, 740);

            // Premium ID BADGE TAG
            ctx.fillStyle = '#18181b';
            ctx.fillRect(cardW / 2 - 160, 780, 320, 50);
            ctx.fillStyle = '#E6FF00';
            ctx.font = '800 24px "Inter", Arial, sans-serif';
            ctx.letterSpacing = "6px";
            ctx.fillText("PORTFOLIO ID", cardW / 2, 814);

            // Roles split into two vibrant and large rows (White color)
            ctx.font = '800 34px "Inter", Arial, sans-serif';
            ctx.letterSpacing = "3px";
            ctx.fillStyle = '#ffffff';
            
            // Role
            ctx.fillText('UI/UX DESIGNER  •  GRAPHIC DESIGNER', cardW / 2, 914);

            // Professional Divider Line above skills
            ctx.beginPath();
            ctx.moveTo(cardW / 2 - 250, 1020);
            ctx.lineTo(cardW / 2 + 250, 1020);
            ctx.strokeStyle = 'rgba(230, 255, 0, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Skills (Safely moved up to avoid bottom-edge UV cutoff!)
            ctx.fillStyle = '#e4e4e7';
            ctx.font = '600 38px "Inter", Arial, sans-serif';
            ctx.letterSpacing = "1.5px";
            const allSkills = [...(skillsData["Design Tools"] || []), ...(skillsData["UI/UX"] || [])];
            
            // Format skills to save space and remove redundant words
            const formatSkills = (skillsArray) => {
                return Array.from(new Set(skillsArray.map(s => s.replace('Adobe', '').trim()).filter(s => s)));
            };
            const formatted = formatSkills(allSkills);
            
            // Render 3 items per row
            const chunks = [];
            for (let i = 0; i < formatted.length; i += 3) {
                 chunks.push(formatted.slice(i, i + 3).join('  •  '));
            }
            
            let skillY = 1070;
            for (let i = 0; i < Math.min(chunks.length, 2); i++) {
                 ctx.fillText(chunks[i], cardW / 2, skillY);
                 skillY += 48;
            }

            // Generate plain back card
            const backCanvas = document.createElement('canvas');
            backCanvas.width = 1000;
            backCanvas.height = 1414;
            const bctx = backCanvas.getContext('2d');
            bctx.fillStyle = '#0f0f11';
            bctx.fillRect(0, 0, 1000, 1414);
            
            // Subtle logo on back
            bctx.fillStyle = '#1a1a1c';
            bctx.textAlign = 'center';
            bctx.font = '800 50px "Inter", Arial, sans-serif';
            bctx.fillText('PORTFOLIO', 500, 707);

            setIdCardDataUrl(canvas.toDataURL('image/png'));
            setBackCardDataUrl(backCanvas.toDataURL('image/png'));
        };

        generateIDCard();
    }, [personal, skillsData]);

    return (
        <div className="relative" style={{ background: "#0a0a0a" }}>
            {/* ═══════ FULL PAGE SQUARES BACKGROUND ═══════ */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction="diagonal"
                    borderColor="#222222"
                    hoverFillColor="#E6FF0018"
                />
            </div>

            {/* ═══════ SECTION 1 — LANYARD ID CARD ═══════ */}
            <section className="relative" style={{ minHeight: "100vh", zIndex: 1 }}>
                <Lanyard position={[0, 0, 13]} gravity={[0, -40, 0]} fov={21} frontSrc={idCardDataUrl} backSrc={backCardDataUrl} />
                <div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    style={{ zIndex: 10 }}
                >
                    <span className="text-text-secondary text-base font-medium animate-pulse">
                        {content.lanyardHint}
                    </span>
                    <svg
                        className="w-6 h-6 text-primary-light animate-bounce"
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
                                texts={personal.rotatingRoles?.length ? personal.rotatingRoles : ["UI/UX Designer", "Graphic Designer"]}
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

