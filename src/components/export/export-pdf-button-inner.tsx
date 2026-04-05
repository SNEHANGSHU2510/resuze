"use client"

import * as React from "react"
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { GlowButton } from "@/components/ui/glow-button"
import { uploadResumePDF, updateResumeWithPDFPath } from "@/lib/pdf/upload-resume-pdf"
import { createClient } from "@/lib/supabase/client"

interface ExportPDFButtonInnerProps {
  getExportElement: () => HTMLElement | null
  resumeId?: string
  title: string
  onExportComplete?: (pdfPath: string) => void
  compact?: boolean
}

type ExportState = "idle" | "rendering" | "uploading" | "success" | "error"

export function ExportPDFButtonInner({
  getExportElement,
  resumeId,
  title,
  onExportComplete,
  compact = false,
}: ExportPDFButtonInnerProps) {
  const [state, setState] = React.useState<ExportState>("idle")
  const [errorMsg, setErrorMsg] = React.useState("")
  const supabase = createClient()

  const handleExport = async () => {
    const element = getExportElement()
    if (!element) {
      setErrorMsg("Resume preview not found")
      setState("error")
      return
    }

    try {
      setState("rendering")

      // Dynamic imports inside the handler — client only
      const html2canvas = (await import("html2canvas-pro")).default
      const { jsPDF } = await import("jspdf")

      const A4_WIDTH_MM = 210
      const A4_HEIGHT_MM = 297

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 800,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdfWidth = A4_WIDTH_MM
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

      let heightLeft = pdfHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight)
      heightLeft -= A4_HEIGHT_MM

      while (heightLeft > 0) {
        position -= A4_HEIGHT_MM
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight)
        heightLeft -= A4_HEIGHT_MM
      }

      const pdfBlob = pdf.output("blob")

      // Upload to Supabase storage if resume ID exists
      if (resumeId) {
        setState("uploading")
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) throw new Error("Not authenticated")

        const pdfPath = await uploadResumePDF(
          supabase,
          userData.user.id,
          resumeId,
          title,
          pdfBlob
        )

        await updateResumeWithPDFPath(supabase, resumeId, pdfPath)
        onExportComplete?.(pdfPath)
      }

      // Trigger browser download
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "_")}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setState("success")
      setTimeout(() => setState("idle"), 3000)
    } catch (err) {
      console.error("Export failed:", err)
      setErrorMsg(err instanceof Error ? err.message : "Export failed")
      setState("error")
      setTimeout(() => setState("idle"), 4000)
    }
  }

  const getButtonContent = () => {
    switch (state) {
      case "rendering":
        return <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Rendering PDF...</>
      case "uploading":
        return <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
      case "success":
        return <><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" /> Exported!</>
      case "error":
        return <><AlertCircle className="w-4 h-4 mr-2 text-red-400" /> {compact ? "Error" : errorMsg}</>
      default:
        return <><Download className="w-4 h-4 mr-2" /> {compact ? "PDF" : "Export PDF"}</>
    }
  }

  return (
    <GlowButton
      onClick={handleExport}
      disabled={state === "rendering" || state === "uploading"}
      variant={state === "success" ? "primary" : "outline"}
      className={compact ? "px-3" : ""}
    >
      {getButtonContent()}
    </GlowButton>
  )
}
