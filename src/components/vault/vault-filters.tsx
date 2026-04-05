"use client"

import * as React from "react"
import { SlidersHorizontal } from "lucide-react"

interface VaultFiltersProps {
  filter: string
  sort: string
  onFilterChange: (f: string) => void
  onSortChange: (s: string) => void
  total: number
}

export function VaultFilters({ filter, sort, onFilterChange, onSortChange, total }: VaultFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="w-4 h-4 text-primary" />
        <span className="text-sm text-white font-medium">{total} resume{total !== 1 ? "s" : ""}</span>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="bg-white/5 border border-white/10 text-xs text-white rounded-md px-3 py-2 cursor-pointer focus:ring-1 focus:ring-primary/50 outline-none"
        >
          <option value="all">All Sources</option>
          <option value="manual">Manual Builds</option>
          <option value="jd_tailoring">JD Tailored</option>
          <option value="exported">Exported Only</option>
          <option value="draft">Drafts Only</option>
        </select>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-white/5 border border-white/10 text-xs text-white rounded-md px-3 py-2 cursor-pointer focus:ring-1 focus:ring-primary/50 outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>
    </div>
  )
}
