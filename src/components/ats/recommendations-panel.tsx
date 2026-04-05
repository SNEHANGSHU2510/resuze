"use client"

import * as React from "react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { ATSRecommendation } from "@/types/ats-report"
import { Lightbulb, ChevronRight } from "lucide-react"

export function RecommendationsPanel({ recommendations }: { recommendations: ATSRecommendation[] }) {
  if (recommendations.length === 0) return null

  const priorityColor = {
    high: "border-l-red-500",
    medium: "border-l-amber-500",
    low: "border-l-blue-500",
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recommendations</h3>
      </div>
      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <div key={i} className={`border-l-2 ${priorityColor[rec.priority]} pl-4 py-2`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-white font-semibold">{rec.message}</span>
            </div>
            <div className="flex items-start gap-1 mt-1">
              <ChevronRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">{rec.action}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  )
}
