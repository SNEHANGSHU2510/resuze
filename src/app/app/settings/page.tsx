import { PageContainer } from "@/components/dashboard/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { GlassPanel } from "@/components/ui/glass-panel"
import { GlowButton } from "@/components/ui/glow-button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { User, Shield, HardDrive, AlertTriangle } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { count: resumeCount } = await supabase.from("resumes").select("*", { count: "exact", head: true }).eq("user_id", user.id)
  const { count: jdCount } = await supabase.from("job_descriptions").select("*", { count: "exact", head: true }).eq("user_id", user.id)

  const displayName = user.user_metadata?.full_name || user.email || "User"
  const provider = user.app_metadata?.provider || "email"

  return (
    <PageContainer>
      <SectionHeader
        title="Settings"
        description="Manage your account, view storage usage, and configure preferences."
      />

      <div className="max-w-2xl space-y-6 mt-6">
        {/* Account Summary */}
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary/10 rounded-lg border border-primary/20">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Account</h3>
              <p className="text-xs text-muted-foreground">Your account details and authentication method</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-4 py-3 border border-white/10 rounded-lg bg-white/5">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Display Name</span>
                <span className="text-sm text-white font-medium">{displayName}</span>
              </div>
            </div>

            <div className="flex justify-between items-center px-4 py-3 border border-white/10 rounded-lg bg-white/5">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Email</span>
                <span className="text-sm text-white font-medium">{user.email}</span>
              </div>
            </div>

            <div className="flex justify-between items-center px-4 py-3 border border-white/10 rounded-lg bg-white/5">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Auth Provider</span>
                <span className="text-sm text-white font-medium capitalize">{provider}</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-full">Active</span>
            </div>

            <div className="flex justify-between items-center px-4 py-3 border border-white/10 rounded-lg bg-white/5">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Member Since</span>
                <span className="text-sm text-white font-medium">
                  {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </GlassPanel>

        {/* Storage & Data */}
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-400/10 rounded-lg border border-blue-400/20">
              <HardDrive className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Storage & Data</h3>
              <p className="text-xs text-muted-foreground">Your platform usage summary</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-center">
              <span className="text-2xl font-black text-white tabular-nums">{resumeCount ?? 0}</span>
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Saved Resumes</span>
            </div>
            <div className="px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-center">
              <span className="text-2xl font-black text-white tabular-nums">{jdCount ?? 0}</span>
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Job Descriptions</span>
            </div>
          </div>

          <div className="mt-4 p-3 border border-white/5 rounded-lg bg-white/2">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-white font-semibold">Private Storage</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All exported PDFs are stored in a private encrypted bucket. Only you can access your files through time-limited signed URLs.
            </p>
          </div>
        </GlassPanel>

        {/* Danger Zone */}
        <GlassPanel className="p-6 border-red-400/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-red-400/10 rounded-lg border border-red-400/20">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Danger Zone</h3>
              <p className="text-xs text-muted-foreground">Irreversible actions that affect your account</p>
            </div>
          </div>

          <div className="p-4 border border-red-400/10 rounded-lg bg-red-400/5">
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data including profile, resumes, job descriptions, ATS reports, and exported PDFs.
            </p>
            <GlowButton
              variant="destructive"
              className="bg-red-500/20 text-red-300 hover:bg-red-500/30"
            >
              Delete Account
            </GlowButton>
          </div>
        </GlassPanel>
      </div>
    </PageContainer>
  )
}
