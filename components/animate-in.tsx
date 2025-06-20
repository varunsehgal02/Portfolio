"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimateInProps {
  children: ReactNode
  delay?: number
  from?: { opacity: number; x?: number; y?: number }
  to?: { opacity: number; x?: number; y?: number }
  className?: string
}

export function AnimateIn({
  children,
  delay = 0,
  from = { opacity: 0, y: 20 },
  to = { opacity: 1, y: 0 },
  className = "",
}: AnimateInProps) {
  return (
    <motion.div
      className={className}
      initial={from}
      whileInView={to}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  )
}

interface AnimateInStaggerProps {
  children: ReactNode
  staggerChildren?: number
  className?: string
}

export function AnimateInStagger({ children, staggerChildren = 0.1, className = "" }: AnimateInStaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
