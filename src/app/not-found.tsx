import Link from "next/link"
import { GlowButton } from "@/components/ui/glow-button"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#0a1a14" }}>
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-30" />
      <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] bg-[var(--neon-blue)]/[0.03] rounded-full blur-[150px]" />

      <div className="relative z-10 text-center space-y-6 px-6 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/10 border border-[var(--neon-blue)]/10 flex items-center justify-center mx-auto">
          <span className="text-4xl">🔍</span>
        </div>
        <div>
          <h1 className="text-7xl font-black text-white text-glow mb-3">404</h1>
          <p className="text-lg text-white/35">This page doesn&apos;t exist or has been moved.</p>
        </div>
        <Link href="/">
          <GlowButton>
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </GlowButton>
        </Link>
      </div>
    </div>
  )
}
