"use client";

import { motion } from "framer-motion";

export default function SkillBadge({ skill, index }) {
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-surface-light text-text-secondary border border-surface-light hover:border-primary/30 hover:text-primary-light hover:bg-primary/5 transition-all duration-300 cursor-default"
        >
            {skill}
        </motion.span>
    );
}
