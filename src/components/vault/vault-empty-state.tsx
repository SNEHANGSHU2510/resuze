"use client"

import * as React from "react"
import { FileText } from "lucide-react"

export function VaultEmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4 px-8 max-w-md">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
          <FileText className="w-10 h-10 text-white/20" />
        </div>
        <h3 className="text-xl text-white font-semibold">Your Vault Is Empty</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Saved resumes and exported PDFs will appear here. Use the Resume Builder or JD Studio to create your first resume.
        </p>
      </div>
    </div>
  )
}
