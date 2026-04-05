import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { normalizeProfileToResume } from "@/lib/templates/normalize-profile-to-resume"
import { buildInitialResumeDraft } from "@/lib/resume/build-initial-resume-draft"
import { ResumeBuilderShell } from "@/components/resume-builder/resume-builder-shell"
import { checkProfileCompleteness } from "@/lib/profile/check-profile-completeness"
import { ProfileGuard } from "@/components/ui/profile-guard"
import { PageContainer } from "@/components/dashboard/page-container"

export default async function ResumeBuilderPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const [
    { data: profile },
    { data: education },
    { data: experience },
    { data: projects },
    { data: skills },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("education").select("*").eq("user_id", user.id).order('start_date', { ascending: false }),
    supabase.from("experience").select("*").eq("user_id", user.id).order('start_date', { ascending: false }),
    supabase.from("projects").select("*").eq("user_id", user.id).order('start_date', { ascending: false }),
    supabase.from("skills").select("*").eq("user_id", user.id),
  ])

  const normalizedData = normalizeProfileToResume({
    profile,
    education,
    experience,
    projects,
    skills
  })

  // Profile completeness gate
  const profileCheck = checkProfileCompleteness(normalizedData)
  if (!profileCheck.complete) {
    return (
      <PageContainer>
        <ProfileGuard
          missingFields={profileCheck.missingFields}
          completionPercent={profileCheck.completionPercent}
        />
      </PageContainer>
    )
  }

  const initialDraft = buildInitialResumeDraft(normalizedData, "ats-classic")

  return (
    <div className="bg-background min-h-screen">
      <ResumeBuilderShell initialDraft={initialDraft} />
    </div>
  )
}

