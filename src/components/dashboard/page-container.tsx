import * as React from "react"
import { cn } from "@/lib/utils"

export function PageContainer({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-y-auto w-full relative", className)} {...props}>
      {/* Ambient glow background */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-cyan-500/[0.02] rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full blur-[150px] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </div>
    </div>
  )
}
