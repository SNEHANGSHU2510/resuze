"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"

interface SectionCardProps extends HTMLMotionProps<"div"> {
  title: string
  description?: string
  children?: React.ReactNode
}

export function SectionCard({ title, description, children, className, ...props }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn("mb-12 group relative", className)}
      {...props}
    >
      {/* Structural Backbone Line */}
      <div className="absolute top-0 bottom-0 left-[2.5rem] md:left-[3.5rem] w-px bg-white/[0.03] z-0 hidden lg:block group-hover:bg-[#34d399]/20 transition-colors duration-700 pointer-events-none" />

      {/* Main Glass Workspace Module */}
      <div className="relative z-10 bg-[#0a1a14]/50 backdrop-blur-2xl border border-white/[0.04] rounded-[2rem] p-6 sm:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.01)] hover:border-white/[0.08] hover:shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(52,211,153,0.02)] transition-all duration-700">
        
        {/* Module Header Area */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b border-white/[0.04] group-hover:border-[#34d399]/10 transition-colors duration-700">
          <div className="flex items-start gap-4 lg:gap-6">
            <div className="hidden lg:flex w-12 h-12 rounded-[1rem] bg-black/50 border border-white/5 items-center justify-center shrink-0">
               <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]/50 animate-pulse group-hover:bg-[#34d399]" />
            </div>
            <div>
              <h3 className="text-2xl font-light text-white tracking-tight mb-2 flex items-center gap-3">
                 {title}
              </h3>
              {description && (
                <p className="text-[15px] font-medium text-white/40 max-w-lg leading-relaxed">{description}</p>
              )}
            </div>
          </div>
          {/* We can inject an optional badge or slot right here via children if needed, but structure is fine */}
        </div>
        
        {/* Dynamic Form Content */}
        <div className="relative pl-0 lg:pl-[4.5rem]">
          {children}
        </div>
        
      </div>
    </motion.div>
  )
}
