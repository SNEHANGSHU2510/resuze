import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { Topbar } from "@/components/dashboard/topbar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <SidebarNav />
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto pb-20 md:pb-0 bg-grid-overlay">
          {children}
        </main>
      </div>
      <MobileNav />
    </DashboardShell>
  )
}
