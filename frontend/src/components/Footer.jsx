"use client";

import Link from "next/link";
import { personalInfo } from "@/data/personal";
import { trackSocialOutboundClick } from "@/lib/analytics";
import { useEditableData } from "@/lib/useEditableData";

export default function Footer() {
    const personal = useEditableData("personal", personalInfo);

    return (
        <footer className="relative z-10 border-t border-surface-light" style={{ backgroundColor: "#0a0a0a" }}>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-display font-bold text-lg">
                                V
                            </div>
                            <span className="font-display font-bold text-xl text-text-primary">
                                Varun Sehgal
                            </span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
                            Crafting user-centered digital experiences that blend aesthetics with functionality.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-display font-semibold text-text-primary">Quick Links</h4>
                        <div className="flex flex-col gap-2">
                            {[
                                { href: "/", label: "Home" },
                                { href: "/about", label: "About" },
                                { href: "/projects", label: "Projects" },
                                { href: "/contact", label: "Contact" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-text-secondary text-sm hover:text-primary-light transition-colors duration-300 w-fit"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Connect */}
                    <div className="space-y-4">
                        <h4 className="font-display font-semibold text-text-primary">Connect</h4>
                        <div className="flex flex-col gap-2">
                            <a
                                href={`tel:${personal.phone}`}
                                className="text-text-secondary text-sm hover:text-primary-light transition-colors duration-300 w-fit flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                {personal.phone}
                            </a>
                            <a
                                href={personal.socials.behance}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackSocialOutboundClick("behance", personal.socials.behance, "footer")}
                                className="text-text-secondary text-sm hover:text-primary-light transition-colors duration-300 w-fit flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                                </svg>
                                Behance
                            </a>
                            <a
                                href={personal.socials.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackSocialOutboundClick("linkedin", personal.socials.linkedin, "footer")}
                                className="text-text-secondary text-sm hover:text-primary-light transition-colors duration-300 w-fit flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                            </a>
                            <a
                                href={`mailto:${personal.email}`}
                                className="text-text-secondary text-sm hover:text-primary-light transition-colors duration-300 w-fit flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                Email
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider & Copyright */}
                <div className="mt-12 pt-8 border-t border-surface-light flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-text-muted text-sm">
                        © {new Date().getFullYear()} Varun Sehgal. All rights reserved.
                    </p>
                    <p className="text-text-muted text-xs">
                        Designed & Built with intent
                    </p>
                </div>
            </div>
        </footer>
    );
}
