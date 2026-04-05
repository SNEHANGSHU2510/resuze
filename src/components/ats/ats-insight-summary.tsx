"use client"

import * as React from "react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { Sparkles } from "lucide-react"

export function ATSInsightSummary({ summary }: { summary: string }) {
  return (
    <GlassPanel className="p-6 border-primary/20">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white mb-2">Analysis Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      </div>
    </GlassPanel>
  )
}
