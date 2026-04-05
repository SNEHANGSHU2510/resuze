import * as React from "react"
import { cn } from "@/lib/utils"
import { GlassPanel } from "@/components/ui/glass-panel"
import { LucideIcon } from "lucide-react"
import { HTMLMotionProps } from "framer-motion"

interface MetricCardProps extends HTMLMotionProps<"div"> {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    label: string
  }
}

export function MetricCard({ title, value, icon: Icon, description, trend, className, ...props }: MetricCardProps) {
  return (
    <GlassPanel className={cn("p-6", className)} {...props}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_theme('colors.primary.DEFAULT')]">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
      </div>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      {trend && (
        <div className="mt-2 flex items-center text-sm">
          <span className={cn(trend.value > 0 ? "text-emerald-400" : "text-destructive font-medium drop-shadow-[0_0_5px_theme('colors.emerald.400')]")}>
            {trend.value > 0 ? "+" : ""}{trend.value}%
          </span>
          <span className="ml-2 text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </GlassPanel>
  )
}
