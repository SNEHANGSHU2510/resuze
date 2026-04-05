"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"

export interface GlassPanelProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: "default" | "subtle" | "heavy" | "neon"
  glow?: boolean
  hover?: boolean
  children?: React.ReactNode
}

export function GlassPanel({
  className,
  variant = "default",
  glow = false,
  hover = false,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl border backdrop-blur-xl overflow-hidden relative transition-all duration-500",
        {
          "bg-white/[0.03] border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.12)]": variant === "default",
          "bg-white/[0.02] border-white/[0.04]": variant === "subtle",
          "bg-[#0d1f18]/80 border-white/[0.1] shadow-[0_12px_40px_rgba(0,0,0,0.2)]": variant === "heavy",
          "bg-[#0d1f18]/60 border-[#34d399]/20 shadow-[0_8px_32px_rgba(52,211,153,0.05)]": variant === "neon",
        },
        glow && "glass-glow flex-shrink-0",
        hover && "hover-lift cursor-pointer",
        className
      )}
      {...props}
    >
      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Inner gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      {variant === "neon" && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#34d399]/[0.03] via-transparent to-[#059669]/[0.02] pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
