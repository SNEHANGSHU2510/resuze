"use client"

import * as React from "react"
import { VaultCard } from "./vault-card"
import { VaultEmptyState } from "./vault-empty-state"
import { VaultFilters } from "./vault-filters"
import { motion, AnimatePresence } from "framer-motion"

interface VaultResume {
  id: string
  title: string
  resume_json: any
  pdf_path: string | null
  exported_at: string | null
  source_type: string | null
  created_at: string
  updated_at: string
}

interface VaultShellProps {
  resumes: VaultResume[]
}

export function VaultShell({ resumes }: VaultShellProps) {
  const [filter, setFilter] = React.useState("all")
  const [sort, setSort] = React.useState("newest")

  // Apply filters
  const filtered = React.useMemo(() => {
    let result = [...resumes]

    switch (filter) {
      case "manual":
        result = result.filter((r) => r.resume_json?.source !== "jd_tailoring" && r.source_type !== "jd_tailoring")
        break
      case "jd_tailoring":
        result = result.filter((r) => r.resume_json?.source === "jd_tailoring" || r.source_type === "jd_tailoring")
        break
      case "exported":
        result = result.filter((r) => !!r.pdf_path)
        break
      case "draft":
        result = result.filter((r) => !r.pdf_path)
        break
    }

    switch (sort) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [resumes, filter, sort])

  if (resumes.length === 0) {
    return <VaultEmptyState />
  }

  return (
    <div>
      <VaultFilters
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
        total={filtered.length}
      />

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((resume, idx) => (
            <motion.div
              layout
              key={resume.id}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ delay: idx * 0.03, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <VaultCard resume={resume} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && resumes.length > 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No resumes match the current filter.</p>
          <button 
            onClick={() => { setFilter("all"); setSort("newest") }}
            className="text-xs text-primary mt-2 underline underline-offset-4 hover:text-white transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
