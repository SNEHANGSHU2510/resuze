import * as React from "react"
import { cn } from "@/lib/utils"
import { GlassPanel } from "./glass-panel"
import { FileQuestion, type LucideIcon } from "lucide-react"
import { HTMLMotionProps } from "framer-motion"

interface EmptyStateProps extends HTMLMotionProps<"div"> {
  title: string
  description: string
  icon?: LucideIcon
  action?: React.ReactNode
}

export function EmptyState({ title, description, icon: Icon = FileQuestion, action, className, ...props }: EmptyStateProps) {
  return (
    <GlassPanel className={cn("flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]", className)} variant="subtle" {...props}>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-6 relative">
        <div className="absolute inset-0 rounded-full animate-pulse blur-xl bg-primary/20" />
        <Icon className="h-10 w-10 text-muted-foreground z-10" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </GlassPanel>
  )
}
