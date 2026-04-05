"use client"

import dynamic from "next/dynamic"

// Dynamically import the actual ExportPDFButton with ssr: false
// This prevents Turbopack from analyzing jspdf/html2canvas during SSR
const ExportPDFButtonInner = dynamic(
  () => import("./export-pdf-button-inner").then(mod => ({ default: mod.ExportPDFButtonInner })),
  { ssr: false, loading: () => <button className="px-3 py-2 text-xs text-muted-foreground bg-white/5 border border-white/10 rounded-lg" disabled>PDF</button> }
)

interface ExportPDFButtonProps {
  getExportElement: () => HTMLElement | null
  resumeId?: string
  title: string
  onExportComplete?: (pdfPath: string) => void
  compact?: boolean
}

export function ExportPDFButton(props: ExportPDFButtonProps) {
  return <ExportPDFButtonInner {...props} />
}
