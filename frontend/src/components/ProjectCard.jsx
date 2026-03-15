"use client";

import { motion } from "framer-motion";
import TiltedCard from "@/components/TiltedCard/TiltedCard";
import { trackProjectClick } from "@/lib/analytics";

export default function ProjectCard({ project, index, onOpen }) {
    const safeProject = project && typeof project === "object" ? project : {};
    const primaryImage =
        (Array.isArray(safeProject.images) && safeProject.images.find((img) => typeof img === "string" && img.trim() !== "")) ||
        safeProject.image ||
        "";
    const hasImage = typeof primaryImage === "string" && primaryImage.trim() !== "";
    const hasVideo = safeProject.video && safeProject.video.trim() !== "";
    const hasMedia = hasImage || hasVideo;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative rounded-2xl overflow-hidden glass card-hover cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => {
                trackProjectClick(safeProject.title || "Untitled Project", safeProject.slug || "");
                onOpen?.(safeProject);
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    trackProjectClick(safeProject.title || "Untitled Project", safeProject.slug || "");
                    onOpen?.(safeProject);
                }
            }}
        >
            {/* Media / Gradient Top Bar */}
            <div className={`relative overflow-hidden h-56 ${hasMedia ? "" : `bg-gradient-to-br ${safeProject.gradient || "from-primary via-secondary to-primary-light"}`}`}>
                {hasImage ? (
                    <TiltedCard
                        imageSrc={primaryImage}
                        altText={safeProject.title || "Project"}
                        captionText={safeProject.title || "Project"}
                        containerHeight="224px"
                        containerWidth="100%"
                        imageHeight="224px"
                        imageWidth="100%"
                        rotateAmplitude={12}
                        scaleOnHover={1.04}
                        showTooltip={false}
                        displayOverlayContent={!hasImage}
                        overlayContent={
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-6xl">{safeProject.icon || "✨"}</span>
                            </div>
                        }
                    />
                ) : hasVideo ? (
                    <video
                        src={safeProject.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-56 object-cover"
                    />
                ) : (
                    <div className="w-full h-56 flex items-center justify-center">
                        <span className="text-6xl">{safeProject.icon || "✨"}</span>
                    </div>
                )}

                {/* Overlay gradient on media */}
                {hasMedia && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                )}

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-sm text-primary-light border border-primary/20">
                        {safeProject.category === "uiux"
                            ? "UI/UX"
                            : safeProject.category === "graphic"
                                ? "Graphic"
                                : "Motion"}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                <h3 className="font-display font-bold text-xl text-text-primary group-hover:text-primary-light transition-colors duration-300">
                    {safeProject.title || "Untitled Project"}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                    {safeProject.description || ""}
                </p>

                {/* Highlights */}
                <div className="grid grid-cols-2 gap-2">
                    {(Array.isArray(safeProject.highlights) ? safeProject.highlights : []).map((highlight, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 text-xs text-text-secondary"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            {highlight}
                        </div>
                    ))}
                </div>

                {/* Tools */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {(Array.isArray(safeProject.tools) ? safeProject.tools : []).map((tool) => (
                        <span
                            key={tool}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-surface-light text-text-secondary border border-surface-light hover:border-primary/30 transition-colors"
                        >
                            {tool}
                        </span>
                    ))}
                </div>

                {/* View Project Link */}
                {safeProject.link && (
                    <div className="pt-2">
                        <a
                            href={safeProject.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group/btn"
                        >
                            <span>View Project</span>
                            <svg
                                className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </a>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
