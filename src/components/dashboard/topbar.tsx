"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function Topbar() {
  const [user, setUser] = React.useState<{ email?: string; name?: string } | null>(null)

  React.useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          email: data.user.email || "",
          name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split("@")[0] || "",
        })
      }
    })
  }, [])

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-14 border-b border-white/[0.04] flex items-center justify-between px-6 shrink-0"
      style={{ background: "rgba(10,26,20,0.6)", backdropFilter: "blur(20px)" }}
    >
      {/* Mobile brand */}
      <div className="flex md:hidden items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#34d399] to-[#059669] flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-white font-bold text-sm">ResumeAI</span>
      </div>

      {/* Spacer */}
      <div className="hidden md:block" />

      {/* User */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-white/70 leading-none">{user.name}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{user.email}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#34d399] to-[#059669] flex items-center justify-center text-white text-xs font-bold shadow-[0_0_12px_rgba(52,211,153,0.2)]">
            {(user.name || "U").charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </motion.header>
  )
}
