"use client"

import * as React from "react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { ShieldCheck } from "lucide-react"

interface TemplateCompatibilityCardProps {
  label: string
  score: number
  note: string
}

export function TemplateCompatibilityCard({ label, score, note }: TemplateCompatibilityCardProps) {
  const getColor = () => {
    if (score >= 85) return "text-emerald-400 border-emerald-400/20"
    if (score >= 65) return "text-amber-400 border-amber-400/20"
    return "text-red-400 border-red-400/20"
  }

  return (
    <GlassPanel className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <ShieldCheck className={`w-5 h-5 ${getColor().split(" ")[0]}`} />
        <div>
          <h4 className="text-sm font-bold text-white">Template Compatibility</h4>
          <span className={`text-xs font-mono ${getColor().split(" ")[0]}`}>{label} • {score}/100</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
    </GlassPanel>
  )
}
