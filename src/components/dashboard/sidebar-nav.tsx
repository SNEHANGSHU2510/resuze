"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  User, LayoutTemplate, FileText, Wand2, BarChart3,
  FolderLock, Settings, Sparkles, LogOut, ChevronLeft
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navItems = [
  { title: "Profile", href: "/app/profile", icon: User, color: "from-emerald-400 to-green-500" },
  { title: "Templates", href: "/app/templates", icon: LayoutTemplate, color: "from-teal-400 to-emerald-500" },
  { title: "Builder", href: "/app/resume-builder", icon: FileText, color: "from-green-400 to-emerald-500" },
  { title: "JD Studio", href: "/app/generate-from-jd", icon: Wand2, color: "from-amber-400 to-orange-500" },
  { title: "ATS Score", href: "/app/ats", icon: BarChart3, color: "from-cyan-400 to-teal-500" },
  { title: "Vault", href: "/app/vault", icon: FolderLock, color: "from-lime-400 to-green-500" },
]

export function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = React.useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "hidden md:flex flex-col h-full border-r border-white/[0.04] transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
      style={{ background: "linear-gradient(180deg, rgba(9,22,16,0.95) 0%, rgba(13,31,24,0.98) 100%)" }}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-white/[0.04]">
        <Link href="/app" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#34d399] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.2)] shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white font-bold tracking-tight"
            >
              ResumeAI
            </motion.span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1" role="navigation" aria-label="Dashboard">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-white/[0.06] text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#34d399]/10 to-transparent border border-[#34d399]/15"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <div className={cn(
                "relative z-10 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all",
                isActive
                  ? `bg-gradient-to-br ${item.color} shadow-lg`
                  : "bg-white/[0.04] group-hover:bg-white/[0.06]"
              )}>
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-white/50 group-hover:text-white/70")} />
              </div>
              {!collapsed && (
                <span className="relative z-10 text-sm font-medium truncate">{item.title}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-1 border-t border-white/[0.04]">
        <Link
          href="/app/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-white/40 hover:text-white/70 hover:bg-white/[0.03]",
            pathname === "/app/settings" && "bg-white/[0.06] text-white"
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
            <Settings className="w-4 h-4" />
          </div>
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-white/30 hover:text-red-400 hover:bg-red-400/[0.05] transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
            <LogOut className="w-4 h-4" />
          </div>
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  )
}
