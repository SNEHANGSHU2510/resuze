"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "ghost" | "outline" | "destructive"
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, size = "md", variant = "primary", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 cursor-pointer select-none",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
          // Sizes
          {
            "px-4 py-2 text-xs gap-1.5": size === "sm",
            "px-6 py-2.5 text-sm gap-2": size === "md",
            "px-8 py-3.5 text-base gap-2.5": size === "lg",
          },
          // Variants — Emerald System
          variant === "primary" && [
            "bg-gradient-to-r from-[#34d399] to-[#059669] text-white",
            "shadow-[0_0_20px_rgba(52,211,153,0.2),0_0_60px_rgba(52,211,153,0.08)]",
            "hover:shadow-[0_0_30px_rgba(52,211,153,0.35),0_0_80px_rgba(52,211,153,0.15)]",
            "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-[#34d399] before:to-[#22d3ee] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-15",
          ],
          variant === "ghost" && [
            "bg-white/[0.04] text-white/80 border border-white/[0.06]",
            "hover:bg-white/[0.08] hover:text-white hover:border-white/[0.12]",
          ],
          variant === "outline" && [
            "bg-transparent text-[#34d399] border border-[#34d399]/30",
            "hover:bg-[#34d399]/10 hover:border-[#34d399]/50",
            "hover:shadow-[0_0_20px_rgba(52,211,153,0.1)]",
          ],
          variant === "destructive" && [
            "bg-gradient-to-r from-red-500 to-red-600 text-white",
            "shadow-[0_0_20px_rgba(239,68,68,0.3),0_0_60px_rgba(239,68,68,0.1)]",
            "hover:shadow-[0_0_30px_rgba(239,68,68,0.5),0_0_80px_rgba(239,68,68,0.2)]",
            "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-red-400 before:to-red-500 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-20",
          ],
          className
        )}
        {...(props as any)}
      >
        <span className="relative z-10 flex items-center gap-inherit">{children}</span>
      </motion.button>
    )
  }
)
GlowButton.displayName = "GlowButton"
