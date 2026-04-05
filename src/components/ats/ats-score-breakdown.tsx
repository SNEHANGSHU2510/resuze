"use client"

import * as React from "react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { ChartDataPoint } from "@/types/ats-report"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface ATSScoreBreakdownProps {
  chartData: ChartDataPoint[]
}

const COLORS: Record<string, string> = {
  Keywords: "#38bdf8",
  Sections: "#a78bfa",
  Format: "#34d399",
  Content: "#fbbf24",
  Relevance: "#f472b6",
}

export function ATSScoreBreakdown({ chartData }: ATSScoreBreakdownProps) {
  return (
    <GlassPanel className="p-6">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Score Breakdown</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={28} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "white",
                fontSize: 12,
              }}
              formatter={(value) => [`${value}%`, "Score"]}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#38bdf8"} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sub-score legend */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-4 border-t border-white/5">
        {chartData.map((d) => (
          <div key={d.name} className="text-center">
            <span className="text-2xl font-black text-white tabular-nums">{d.score}</span>
            <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{d.name}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  )
}
