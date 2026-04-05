import { PageContainer } from "@/components/dashboard/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { normalizeProfileToResume } from "@/lib/templates/normalize-profile-to-resume"
import { TemplateGallery } from "@/components/templates/template-gallery"

export default async function TemplatesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all user profile data necessary for resume rendering
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

  // Normalize mapping to match the strictly typed deterministic templates
  const normalizedData = normalizeProfileToResume({
    profile, 
    education, 
    experience, 
    projects, 
    skills
  })

  return (
    <PageContainer>
      <SectionHeader 
        title="Template Gallery" 
        description="Select the architectural foundation for your AI-generated resumes. Our pre-configured templates guarantee perfect ATS compliance and expert layouts." 
      />
      
      <div className="mt-8">
        <TemplateGallery normalizedData={normalizedData} />
      </div>
    </PageContainer>
  )
}
