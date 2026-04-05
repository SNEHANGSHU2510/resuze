import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PageContainer } from "@/components/dashboard/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { VaultShell } from "@/components/vault/vault-shell"

export default async function VaultPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: resumes } = await supabase
    .from("resumes")
    .select("id, title, resume_json, pdf_path, exported_at, source_type, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <PageContainer>
      <SectionHeader
        title="Resume Vault"
        description="Your private collection of resume versions. Download, duplicate, or manage all your saved documents from one place."
      />

      <div className="mt-8">
        <VaultShell resumes={resumes || []} />
      </div>
    </PageContainer>
  )
}
