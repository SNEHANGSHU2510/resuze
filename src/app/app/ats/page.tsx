import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PageContainer } from "@/components/dashboard/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { ATSShell } from "@/components/ats/ats-shell"

export default async function ATSPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch saved resumes and job descriptions
  const [
    { data: resumes },
    { data: jobDescriptions },
  ] = await Promise.all([
    supabase
      .from("resumes")
      .select("id, title, resume_json, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("job_descriptions")
      .select("id, job_title, company, content, parsed_requirements")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ])

  return (
    <PageContainer>
      <SectionHeader
        title="ATS Intelligence Center"
        description="Analyze your resume against a target job description. Get explainable scores, keyword coverage, and actionable recommendations."
      />

      <div className="mt-6">
        <ATSShell
          savedResumes={resumes || []}
          savedJDs={jobDescriptions || []}
        />
      </div>
    </PageContainer>
  )
}
