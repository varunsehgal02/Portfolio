"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Only show on very first visit in this browser session
    useEffect(() => {
        setMounted(true);
        const shown = sessionStorage.getItem("loading_shown");
        if (shown) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
            sessionStorage.setItem("loading_shown", "true");
        }, 650);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted || !isLoading) return null;

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
                >
                    {/* Background effects */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl"
                        />
                        <motion.div
                            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl"
                        />
                    </div>

                    <div className="relative z-10 text-center">
                        {/* Logo / Initials */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.45, type: "spring", bounce: 0.25 }}
                            className="mx-auto mb-8 w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30"
                        >
                            <span className="font-display font-extrabold text-4xl text-white">VS</span>
                        </motion.div>

                        {/* Name */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.35 }}
                            className="font-display font-bold text-3xl text-text-primary mb-3"
                        >
                            Varun Sehgal
                        </motion.h1>

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.18, duration: 0.3 }}
                            className="flex items-center justify-center gap-2"
                        >
                            <motion.p
                                initial={{ width: 0 }}
                                animate={{ width: "auto" }}
                                transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
                                className="overflow-hidden whitespace-nowrap text-text-secondary text-sm font-medium"
                            >
                                UI/UX Designer · Graphic Designer · Motion Artist
                            </motion.p>
                            <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-0.5 h-5 bg-primary inline-block"
                            />
                        </motion.div>

                        {/* Loading bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.08 }}
                            className="mt-10 mx-auto w-48 h-1 rounded-full bg-surface-light overflow-hidden"
                        >
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.12, duration: 0.45, ease: "easeInOut" }}
                                className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
