"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function DashboardShell({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col h-screen overflow-hidden text-foreground relative", className)}
      style={{ background: "linear-gradient(135deg, #0a1a14 0%, #0d1f18 50%, #0a1a14 100%)" }}
      {...props}
    >
      {/* Ambient emerald glow effects */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#34d399]/[0.015] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-[#059669]/[0.015] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-40 z-0" />
      
      <div className="flex flex-1 overflow-hidden relative z-10">
        {children}
      </div>
    </div>
  )
}
