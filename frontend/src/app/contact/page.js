"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "@/data/personal";
import { contactPageContent } from "@/data/pageContent";
import { useEditableData } from "@/lib/useEditableData";
import SectionHeading from "@/components/SectionHeading";
import LightRays from "@/components/LightRays";
import StickerPeel from "@/components/StickerPeel/StickerPeel";
import TargetCursor from "@/components/TargetCursor/TargetCursor";
import { submitContactMessage } from "@/lib/contact";
import { trackSocialOutboundClick } from "@/lib/analytics";

export default function ContactPage() {
    const personal = useEditableData("personal", personalInfo);
    const content = useEditableData("contactContent", contactPageContent);

    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [touched, setTouched] = useState({ name: false, email: false, message: false });
    const [fieldErrors, setFieldErrors] = useState({ name: "", email: "", message: "" });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isMobile, setIsMobile] = useState(true);
    const messageMaxLength = 4000;
    const messageLength = formData.message.length;

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQueries = [
            window.matchMedia("(max-width: 768px)"),
            window.matchMedia("(hover: none) and (pointer: coarse)"),
        ];

        const updateIsMobile = () => {
            setIsMobile(mediaQueries.some((query) => query.matches));
        };

        updateIsMobile();

        mediaQueries.forEach((query) => {
            if (typeof query.addEventListener === "function") {
                query.addEventListener("change", updateIsMobile);
            } else {
                query.addListener(updateIsMobile);
            }
        });

        return () => {
            mediaQueries.forEach((query) => {
                if (typeof query.removeEventListener === "function") {
                    query.removeEventListener("change", updateIsMobile);
                } else {
                    query.removeListener(updateIsMobile);
                }
            });
        };
    }, []);

    const validateField = (field, value) => {
        const text = value.trim();

        if (field === "name") {
            if (text.length < 2) return "Name must be at least 2 characters.";
            if (text.length > 100) return "Name must be 100 characters or less.";
            return "";
        }

        if (field === "email") {
            if (!text) return "Email is required.";
            if (!/^\S+@\S+\.\S+$/.test(text)) return "Please enter a valid email address.";
            if (text.length > 200) return "Email must be 200 characters or less.";
            return "";
        }

        if (field === "message") {
            if (text.length < 5) return "Message must be at least 5 characters.";
            if (text.length > messageMaxLength) return "Message must be 4000 characters or less.";
            return "";
        }

        return "";
    };

    const validateForm = (nextData) => ({
        name: validateField("name", nextData.name),
        email: validateField("email", nextData.email),
        message: validateField("message", nextData.message),
    });

    const hasFieldErrors = (errors) => Object.values(errors).some(Boolean);

    const setFormField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (touched[field]) {
            setFieldErrors((prev) => ({
                ...prev,
                [field]: validateField(field, value),
            }));
        }
    };

    const handleFieldBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setFieldErrors((prev) => ({
            ...prev,
            [field]: validateField(field, formData[field]),
        }));
    };

    const showFieldError = (field) => touched[field] && fieldErrors[field];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");

        const nextErrors = validateForm(formData);
        setFieldErrors(nextErrors);
        setTouched({ name: true, email: true, message: true });

        if (hasFieldErrors(nextErrors)) {
            setSubmitError("Please fix the highlighted fields and try again.");
            return;
        }

        setIsSubmitting(true);

        try {
            await submitContactMessage(formData);
            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 4000);
            setFormData({ name: "", email: "", message: "" });
            setTouched({ name: false, email: false, message: false });
            setFieldErrors({ name: "", email: "", message: "" });
        } catch (err) {
            const message = err instanceof Error ? err.message : "";
            const normalized = message.toLowerCase();

            if (normalized.includes("too many contact requests")) {
                setSubmitError(message);
            } else if (normalized.includes("invalid contact payload")) {
                setSubmitError("Please check your inputs and try again.");
            } else if (normalized.includes("timed out") || normalized.includes("timeout")) {
                setSubmitError("Sending is taking too long. Please try again.");
            } else if (normalized.includes("failed to fetch") || normalized.includes("network")) {
                setSubmitError("Unable to reach server. Please try again in a moment.");
            } else {
                setSubmitError(message || "Could not send message right now. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactDetails = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            label: "Email",
            value: personal.email,
            href: `mailto:${personal.email}`,
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            label: "Phone",
            value: personal.phone,
            href: `tel:${personal.phone}`,
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            label: "Location",
            value: personal.location,
            href: null,
        },
    ];

    const socialLinks = [
        {
            name: "Behance",
            platform: "behance",
            href: personal.socials.behance,
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                </svg>
            ),
        },
        {
            name: "LinkedIn",
            platform: "linkedin",
            href: personal.socials.linkedin,
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="relative pt-28 pb-20">
            <TargetCursor
                targetSelector="button, a, input, textarea, select, .cursor-target"
                spinDuration={2}
                hideDefaultCursor
                parallaxOn
                hoverDuration={0.2}
            />

            {/* LightRays Full Page Background */}
            <div className="fixed inset-0 z-0">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#ffffff"
                    raysSpeed={1}
                    lightSpread={0.5}
                    rayLength={3}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0}
                    distortion={0}
                    pulsating={false}
                    fadeDistance={1}
                    saturation={1}
                />
            </div>

            {/* Draggable sticker overlay across full contact page (desktop only) */}
            {!isMobile && (
                <div className="fixed inset-0 z-[2] pointer-events-none">
                    <div className="relative w-full h-full">
                        <StickerPeel
                            className="pointer-events-auto"
                            imageSrc="/projects/social-media.png"
                            dragHandleLabel="Pull & Move"
                            width={190}
                            rotate={0}
                            peelBackHoverPct={30}
                            peelBackActivePct={40}
                            shadowIntensity={0.5}
                            lightingIntensity={0.1}
                            initialPosition={{ x: 26, y: 170 }}
                            peelDirection={0}
                        />
                    </div>
                </div>
            )}

            <section className="relative z-[1] max-w-7xl mx-auto px-6">
                <SectionHeading
                    title={content.headingTitle}
                    subtitle={content.headingSubtitle}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Left: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35 }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="font-display font-bold text-2xl text-text-primary mb-4">
                                {content.introTitlePrefix} <span className="gradient-text">{content.introTitleHighlight}</span>
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                {content.introParagraph}
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-4">
                            {contactDetails.map((detail, i) => (
                                <motion.div
                                    key={detail.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                >
                                    {detail.href ? (
                                        <a
                                            href={detail.href}
                                            className="flex items-center gap-4 glass rounded-xl p-4 card-hover group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary-light group-hover:bg-primary/20 transition-colors">
                                                {detail.icon}
                                            </div>
                                            <div>
                                                <p className="text-text-muted text-xs">{detail.label}</p>
                                                <p className="text-text-primary text-sm font-medium">{detail.value}</p>
                                            </div>
                                        </a>
                                    ) : (
                                        <div className="flex items-center gap-4 glass rounded-xl p-4">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary-light">
                                                {detail.icon}
                                            </div>
                                            <div>
                                                <p className="text-text-muted text-xs">{detail.label}</p>
                                                <p className="text-text-primary text-sm font-medium">{detail.value}</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div>
                            <p className="text-text-muted text-sm mb-4">{content.socialTitle}</p>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => trackSocialOutboundClick(social.platform, social.href, "/contact")}
                                        className="w-12 h-12 rounded-xl glass flex items-center justify-center text-text-secondary hover:text-primary-light hover:border-primary/30 transition-all duration-300 hover:scale-110"
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                            <a
                                href="/resume/Varun_Sehgal.pdf"
                                download
                                className="inline-flex mt-4 items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 text-primary-light text-sm font-medium hover:bg-primary/10 transition-all duration-300"
                            >
                                Download Resume
                            </a>
                        </div>

                    </motion.div>

                    {/* Right: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-text-secondary text-sm font-medium mb-2">
                                    {content.formNameLabel}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormField("name", e.target.value)}
                                    onBlur={() => handleFieldBlur("name")}
                                    aria-invalid={Boolean(showFieldError("name"))}
                                    className={`w-full px-4 py-3 rounded-xl bg-surface-light border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 ${showFieldError("name") ? "border-red-400/70" : "border-surface-light"}`}
                                    placeholder="John Doe"
                                />
                                {showFieldError("name") && <p className="text-red-400 text-xs mt-2">{fieldErrors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-text-secondary text-sm font-medium mb-2">
                                    {content.formEmailLabel}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormField("email", e.target.value)}
                                    onBlur={() => handleFieldBlur("email")}
                                    aria-invalid={Boolean(showFieldError("email"))}
                                    className={`w-full px-4 py-3 rounded-xl bg-surface-light border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 ${showFieldError("email") ? "border-red-400/70" : "border-surface-light"}`}
                                    placeholder="john@example.com"
                                />
                                {showFieldError("email") && <p className="text-red-400 text-xs mt-2">{fieldErrors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-text-secondary text-sm font-medium mb-2">
                                    {content.formMessageLabel}
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    rows={5}
                                    maxLength={messageMaxLength}
                                    value={formData.message}
                                    onChange={(e) => setFormField("message", e.target.value)}
                                    onBlur={() => handleFieldBlur("message")}
                                    aria-invalid={Boolean(showFieldError("message"))}
                                    className={`w-full px-4 py-3 rounded-xl bg-surface-light border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 resize-none ${showFieldError("message") ? "border-red-400/70" : "border-surface-light"}`}
                                    placeholder="Tell me about your project..."
                                />
                                <p className={`text-xs mt-2 ${messageLength > messageMaxLength - 200 ? "text-amber-300" : "text-text-muted"}`}>
                                    {messageLength} / {messageMaxLength}
                                </p>
                                {showFieldError("message") && <p className="text-red-400 text-xs mt-2">{fieldErrors.message}</p>}
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${isSubmitted
                                    ? "bg-green-500"
                                    : "bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25"
                                    }`}
                            >
                                {isSubmitted ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {content.formSubmitSuccess}
                                    </span>
                                ) : (
                                    isSubmitting ? "Sending..." : content.formSubmitLabel
                                )}
                            </motion.button>
                            {submitError && <p className="text-red-400 text-sm">{submitError}</p>}
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
