"use client";

import { motion } from "framer-motion";

export default function SectionHeading({ title, subtitle, align = "center" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}
        >
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
                    {subtitle}
                </p>
            )}
            <div className={`mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-secondary ${align === "center" ? "mx-auto" : ""}`} />
        </motion.div>
    );
}
