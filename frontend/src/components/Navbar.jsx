"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const StaggeredMenu = dynamic(() => import("@/components/StaggeredMenu"), { ssr: false });
import { personalInfo } from "@/data/personal";
import { useEditableData } from "@/lib/useEditableData";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
];

const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/" },
    { label: "About", ariaLabel: "Learn about me", link: "/about" },
    { label: "Projects", ariaLabel: "View my projects", link: "/projects" },
    { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
];

const DEFAULT_SOCIALS = {
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    instagram: "https://instagram.com",
};

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const personal = useEditableData("personal", personalInfo);
    const socialItems = [
        { label: "LinkedIn", link: personal.socials?.linkedin || DEFAULT_SOCIALS.linkedin },
        { label: "GitHub", link: personal.socials?.github || DEFAULT_SOCIALS.github },
        { label: "Instagram", link: personal.socials?.instagram || DEFAULT_SOCIALS.instagram },
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Trigger loading screen and navigate
    const handleNavClick = (e, href) => {
        if (href === pathname) return; // Already on this page
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("page-transition"));
        setTimeout(() => router.push(href), 400);
    };

    // Trigger full loading screen when clicking "Varun" logo
    const handleLogoClick = (e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("trigger-loading"));
        setTimeout(() => router.push("/"), 500);
    };

    const handleMenuItemClick = (item) => {
        if (item.link === pathname) return;
        window.dispatchEvent(new CustomEvent("page-transition"));
        setTimeout(() => router.push(item.link), 400);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "glass-strong shadow-lg shadow-primary/5 py-3" : "py-5"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo - Clicking triggers loading screen */}
                    <a href="/" onClick={handleLogoClick} className="group flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-display font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                            V
                        </div>
                        <span className="font-display font-bold text-xl text-text-primary hidden sm:block">
                            Varun Sehgal
                        </span>
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${pathname === link.href
                                    ? "text-primary-light"
                                    : "text-text-secondary hover:text-text-primary"
                                    }`}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </a>
                        ))}
                    </div>

                    {/* CTA Button - Desktop */}
                    <a
                        href="/contact"
                        onClick={(e) => handleNavClick(e, "/contact")}
                        className="hidden md:block px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-black text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                        Let&apos;s Talk
                    </a>
                </div>
            </motion.nav>

            {/* Mobile StaggeredMenu */}
            <div className="md:hidden fixed inset-0 z-[60] pointer-events-none">
                <StaggeredMenu
                    position="right"
                    items={menuItems}
                    socialItems={socialItems}
                    displaySocials
                    displayItemNumbering={true}
                    menuButtonColor="#e6ff00"
                    openMenuButtonColor="#e6ff00"
                    changeMenuColorOnOpen={true}
                    colors={["#0a0a0a", "#151515"]}
                    accentColor="#E6FF00"
                    isFixed
                    onItemClick={handleMenuItemClick}
                />
            </div>
        </>
    );
}
