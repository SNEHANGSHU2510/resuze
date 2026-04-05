"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  User, LayoutTemplate, FileText, Wand2, BarChart3,
  FolderLock, Settings
} from "lucide-react"

const navItems = [
  { title: "Profile", href: "/app/profile", icon: User },
  { title: "Templates", href: "/app/templates", icon: LayoutTemplate },
  { title: "Builder", href: "/app/resume-builder", icon: FileText },
  { title: "JD", href: "/app/generate-from-jd", icon: Wand2 },
  { title: "ATS", href: "/app/ats", icon: BarChart3 },
  { title: "Vault", href: "/app/vault", icon: FolderLock },
  { title: "Settings", href: "/app/settings", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-heavy"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#34d399]/20 to-transparent" />
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl min-w-[46px] transition-all relative",
                isActive ? "text-[#34d399]" : "text-white/30"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute -top-0.5 w-6 h-0.5 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-medium">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
