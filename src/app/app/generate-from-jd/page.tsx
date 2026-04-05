import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { normalizeProfileToResume } from "@/lib/templates/normalize-profile-to-resume"
import { PageContainer } from "@/components/dashboard/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { JDBuilderShell } from "@/components/jd-builder/jd-builder-shell"
import { checkProfileCompleteness } from "@/lib/profile/check-profile-completeness"
import { ProfileGuard } from "@/components/ui/profile-guard"

export default async function GenerateFromJDPage() {
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
    supabase.from("education").select("*").eq("user_id", user.id).order("start_date", { ascending: false }),
    supabase.from("experience").select("*").eq("user_id", user.id).order("start_date", { ascending: false }),
    supabase.from("projects").select("*").eq("user_id", user.id).order("start_date", { ascending: false }),
    supabase.from("skills").select("*").eq("user_id", user.id),
  ])

  const normalizedData = normalizeProfileToResume({
    profile,
    education,
    experience,
    projects,
    skills,
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

  return (
    <PageContainer>
      <SectionHeader
        title="JD-Targeted Resume Studio"
        description="Paste a job description, and we'll intelligently tailor your resume to maximize relevance and keyword alignment."
      />

      <div className="mt-6">
        <JDBuilderShell normalizedData={normalizedData} />
      </div>
    </PageContainer>
  )
}

