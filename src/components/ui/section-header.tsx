"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"

interface SectionHeaderProps extends HTMLMotionProps<"div"> {
  title: string
  description?: string
  action?: React.ReactNode
  accent?: string
}

export function SectionHeader({ title, description, action, accent, className, ...props }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("mb-8 flex items-end justify-between", className)}
      {...props}
    >
      <div className="space-y-2">
        {accent && (
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--neon-blue)] block">
            {accent}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-white/40 max-w-lg leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  )
}
