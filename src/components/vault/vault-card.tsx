"use client"

import * as React from "react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { GlowButton } from "@/components/ui/glow-button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useToast } from "@/components/ui/toast-provider"
import { Download, Copy, Trash2, FileText, Loader2, Calendar } from "lucide-react"
import { getResumeSignedUrl } from "@/lib/pdf/get-resume-signed-url"
import { deleteResumeVersion, duplicateResumeVersion } from "@/lib/vault/vault-actions"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

interface VaultCardProps {
  resume: {
    id: string
    title: string
    created_at: string
    updated_at: string
    pdf_path?: string | null
    source_type?: string | null
    resume_json?: any
  }
}

export function VaultCard({ resume }: VaultCardProps) {
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [isDuplicating, setIsDuplicating] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const templateSlug = resume.resume_json?.template_slug || "ats-classic"
  const sourceLabel = resume.source_type === "jd_tailoring" ? "JD Tailored" : "Manual Build"
  const date = new Date(resume.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const handleDownload = async () => {
    if (!resume.pdf_path) {
      toast("warning", "No PDF exported yet. Generate the PDF from the builder first.")
      return
    }
    try {
      setIsDownloading(true)
      const supabase = createClient()
      const url = await getResumeSignedUrl(supabase, resume.pdf_path)
      if (url) {
        window.open(url, "_blank")
        toast("success", "PDF download started")
      }
    } catch { toast("error", "Download failed") }
    finally { setIsDownloading(false) }
  }

  const handleDuplicate = async () => {
    try {
      setIsDuplicating(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      await duplicateResumeVersion(supabase, user.id, resume.id)
      toast("success", "Resume duplicated")
      router.refresh()
    } catch { toast("error", "Duplication failed") }
    finally { setIsDuplicating(false) }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const supabase = createClient()
      await deleteResumeVersion(supabase, resume.id, resume.pdf_path || null)
      toast("success", "Resume deleted")
      setShowDeleteConfirm(false)
      router.refresh()
    } catch { toast("error", "Deletion failed") }
    finally { setIsDeleting(false) }
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <GlassPanel hover className="p-5 group">
          {/* Top row */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/10 border border-[var(--neon-blue)]/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[var(--neon-blue)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm truncate">{resume.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--neon-blue)]/10 text-[var(--neon-blue)] border border-[var(--neon-blue)]/10 font-medium">
                  {sourceLabel}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 font-medium">
                  {templateSlug}
                </span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 mt-4 text-white/25 text-xs">
            <Calendar className="w-3 h-3" />
            {date}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.04]">
            <GlowButton
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              aria-label="Download PDF"
            >
              {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span className="ml-1.5">PDF</span>
            </GlowButton>
            <GlowButton
              variant="ghost"
              size="sm"
              onClick={handleDuplicate}
              disabled={isDuplicating}
              aria-label="Duplicate"
            >
              {isDuplicating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="ml-1.5">Clone</span>
            </GlowButton>
            <div className="flex-1" />
            <GlowButton
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-400/60 hover:text-red-400"
              aria-label="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </GlowButton>
          </div>
        </GlassPanel>
      </motion.div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete Resume Version"
        description="This resume and its exported PDF will be permanently deleted."
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  )
}
