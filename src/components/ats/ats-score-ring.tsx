"use client"

import * as React from "react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { motion } from "framer-motion"

interface ATSScoreRingProps {
  score: number
  label?: string
}

export function ATSScoreRing({ score, label = "ATS Score" }: ATSScoreRingProps) {
  const radius = 80
  const stroke = 12
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getColor = (s: number) => {
    if (s >= 80) return "var(--neon-cyan)" // cyan
    if (s >= 60) return "var(--neon-blue)" // blue
    if (s >= 40) return "#fbbf24" // amber
    return "#f87171" // red
  }

  const color = getColor(score)

  return (
    <GlassPanel hover className="p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
      {/* Background ambient glow pulse */}
      <div 
        className="absolute inset-0 opacity-10 blur-3xl pointer-events-none transition-all duration-1000 group-hover:opacity-20 translate-y-10 group-hover:translate-y-0"
        style={{ backgroundColor: color }}
      />
      
      <div className="relative isolate" style={{ width: radius * 2, height: radius * 2 }}>
        <svg width={radius * 2} height={radius * 2} className="transform -rotate-90">
          {/* Background track */}
          <circle
            stroke="var(--neon-blue)"
            strokeOpacity={0.05}
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated Score Track */}
          <motion.circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{
              strokeDasharray: circumference,
              filter: `drop-shadow(0 0 12px ${color}80)`,
            }}
          />
        </svg>
        
        {/* Center Numbers */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-5xl font-black text-white tabular-nums drop-shadow-md"
          >
            {score}
          </motion.span>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-1"
          >
            / 100
          </motion.span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-6 z-10"
      >
        <h3 className="text-sm font-bold text-white uppercase tracking-[0.15em]">{label}</h3>
        <p className="text-xs text-[var(--neon-blue)]/80 font-medium mt-1.5 uppercase tracking-widest">
          {score >= 80 ? "Optimized Array" : score >= 60 ? "Competitive Node" : score >= 40 ? "Sub-Optimal" : "Critically Flawed"}
        </p>
      </motion.div>
    </GlassPanel>
  )
}
