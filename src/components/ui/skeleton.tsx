import * as React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "circle" | "card" | "block"
  width?: string
  height?: string
}

export function Skeleton({ className, variant = "line", width, height, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "premium-shimmer bg-white/[0.03] border border-white/[0.02]",
        {
          "h-4 w-full rounded-md": variant === "line",
          "rounded-full": variant === "circle",
          "rounded-xl h-40 w-full": variant === "card",
          "rounded-lg w-full": variant === "block",
        },
        className
      )}
      style={{ width, height }}
      {...props}
    />
  )
}

/** Reusable skeleton pattern for vault/resume list cards */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4 premium-shimmer">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-20 bg-white/5 rounded-full" />
        <div className="h-5 w-16 bg-white/5 rounded-full" />
      </div>
      <div className="flex gap-2 pt-3 border-t border-white/5">
        <div className="h-8 flex-1 bg-white/5 rounded-lg" />
        <div className="h-8 w-8 bg-white/5 rounded-lg" />
        <div className="h-8 w-8 bg-white/5 rounded-lg" />
      </div>
    </div>
  )
}

/** Skeleton for form/profile sections */
export function FormSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-5 premium-shimmer">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-white/10 rounded w-24" />
          <div className="h-10 bg-white/5 rounded-lg w-full" />
        </div>
      ))}
    </div>
  )
}

/** Skeleton for analytics / score sections */
export function ScoreSkeleton() {
  return (
    <div className="flex items-center justify-center premium-shimmer">
      <div className="w-40 h-40 rounded-full border-4 border-white/10" />
    </div>
  )
}
