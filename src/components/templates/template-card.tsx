"use client"

import * as React from "react"
import { Check, Eye, LayoutTemplate, Zap, ShieldCheck } from "lucide-react"
import { ResumeTemplate, ATSCompatibility } from "@/types/resume-template"
import { GlassPanel } from "@/components/ui/glass-panel"
import { GlowButton } from "@/components/ui/glow-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface TemplateCardProps {
  template: ResumeTemplate
  isSelected: boolean
  onSelect: (slug: string) => void
  onPreview: (slug: string) => void
}

const getAtsIcon = (label: ATSCompatibility) => {
  switch (label) {
    case "ATS Safe":
      return <ShieldCheck className="w-3 h-3 mr-1" />
    case "Hybrid":
      return <Zap className="w-3 h-3 mr-1" />
    case "Visual Premium":
      return <LayoutTemplate className="w-3 h-3 mr-1" />
  }
}

const getAtsColor = (label: ATSCompatibility) => {
  switch (label) {
    case "ATS Safe":
      return "text-emerald-400 border-emerald-400/20 bg-emerald-400/10"
    case "Hybrid":
      return "text-blue-400 border-blue-400/20 bg-blue-400/10"
    case "Visual Premium":
      return "text-purple-400 border-purple-400/20 bg-purple-400/10"
  }
}

export function TemplateCard({ template, isSelected, onSelect, onPreview }: TemplateCardProps) {
  return (
    <GlassPanel 
      hover={!isSelected}
      className={cn(
        "relative overflow-hidden group transition-all duration-500 transform-gpu",
        isSelected 
          ? "ring-2 ring-primary shadow-[0_0_30px_rgba(52,211,153,0.2)] scale-[1.02] border-primary/50" 
          : ""
      )}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-primary text-black p-1.5 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-in zoom-in duration-300">
            <Check className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Decorative gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

      <div className="p-6">
        <div className="relative aspect-[1/1.4] bg-[#050b08] rounded-xl border border-white/10 overflow-hidden mb-6 group-hover:border-primary/30 transition-all duration-700 flex items-center justify-center transform-gpu group-hover:scale-[1.03] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
           {/* In actual production, this would be image */}
           <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[rgba(52,211,153,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen" />
           <LayoutTemplate className="w-16 h-16 text-white/10" />
           <div className="absolute font-bold text-white/5 uppercase tracking-widest text-4xl -rotate-45">
             {template.name}
           </div>

           {/* Hover Actions */}
           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm z-10">
             <Button 
               variant="outline" 
               size="sm" 
               className="bg-black/50 border-white/20 text-white hover:bg-white inset-auto"
               onClick={(e) => {
                 e.stopPropagation()
                 onPreview(template.slug)
               }}
             >
               <Eye className="w-4 h-4 mr-2" />
               Preview
             </Button>
           </div>
        </div>

        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white tracking-wide">{template.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{template.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={cn(
              "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border flex items-center",
              getAtsColor(template.ats_label)
            )}>
              {getAtsIcon(template.ats_label)}
              {template.ats_label}
            </span>
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border border-white/10 bg-white/5 text-white/70">
              {template.layout}
            </span>
          </div>

          <GlowButton 
            className="w-full"
            variant={isSelected ? "primary" : "outline"}
            onClick={() => onSelect(template.slug)}
          >
            {isSelected ? "Selected" : "Use Template"}
          </GlowButton>
        </div>
      </div>
    </GlassPanel>
  )
}
