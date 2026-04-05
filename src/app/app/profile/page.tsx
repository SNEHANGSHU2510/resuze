import { SectionHeader } from "@/components/ui/section-header"
import { GlowButton } from "@/components/ui/glow-button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

import { ProfileProgressCard } from "@/components/profile/profile-progress-card"
import { PersonalDetailsForm } from "@/components/profile/personal-details-form"
import { EducationSection } from "@/components/profile/education-section"
import { ExperienceSection } from "@/components/profile/experience-section"
import { ProjectsSection } from "@/components/profile/projects-section"
import { SkillsSection } from "@/components/profile/skills-section"
import { ProfessionalDashboard } from "@/components/profile/professional-dashboard"
import { Terminal, Database } from "lucide-react"

export default async function ProfilePage(
  props: { searchParams: Promise<{ [key: string]: string | undefined }> }
) {
  const searchParams = await props.searchParams;
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all profile data concurrently
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

  let completionPoints = 0
  if (profile?.first_name && profile?.last_name) completionPoints += 15
  if (profile?.summary) completionPoints += 15
  if (profile?.linkedin_url || profile?.github_url) completionPoints += 10
  if (education && education.length > 0) completionPoints += 15
  if (experience && experience.length > 0) completionPoints += 25
  if (projects && projects.length > 0) completionPoints += 10
  if (skills && skills.length > 0) completionPoints += 10

  const completionPercent = Math.min(100, completionPoints)
  const isEditing = searchParams.mode === "edit"
  const showDashboard = completionPercent >= 50 && !isEditing

  return (
    <div className="relative min-h-screen bg-[#0a1a14] font-sans selection:bg-[#34d399]/30 selection:text-white">
      {/* Immersive Emerald Workspace Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-[15%] w-[800px] h-[600px] bg-[radial-gradient(circle_at_center,_#34d399,_transparent_60%)] opacity-[0.025] blur-[150px] mix-blend-screen" />
         <div className="absolute bottom-0 left-[5%] w-[600px] h-[500px] bg-[radial-gradient(circle_at_center,_#059669,_transparent_70%)] opacity-[0.02] blur-[120px] mix-blend-screen" />
         
         {/* Subtle System Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_10%,black_30%,transparent_100%)] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 py-16 md:py-24">
        {showDashboard ? (
          <>
            <div className="flex items-center gap-3 mb-10 px-2">
               <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center">
                 <Database className="w-4 h-4 text-[#34d399]" />
               </div>
               <div>
                 <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 block">System Hub</span>
                 <span className="text-[12px] font-medium text-[#34d399] tracking-wide">Dashboard Live</span>
               </div>
            </div>
            <ProfessionalDashboard 
              profile={profile || {}}
              education={education || []}
              experience={experience || []}
              projects={projects || []}
              skills={skills || []}
              completionPercent={completionPercent}
            />
          </>
        ) : (
          <>
            {/* Workspace Context Info */}
            <div className="flex items-center gap-3 mb-10 px-2">
               <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center">
                 <Database className="w-4 h-4 text-[#34d399]" />
               </div>
               <div>
                 <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 block">Session Validated</span>
                 <span className="text-[12px] font-medium text-[#34d399] tracking-wide">Encrypted Tunnel Active</span>
               </div>
            </div>

            <SectionHeader 
              title="Identity Compilation" 
              description="Establish the unstructured payload for your professional profile. The intelligence kernel ingests this data instantly." 
              action={
                completionPercent >= 50 ? (
                  <form action={async () => {
                    "use server";
                    redirect("/app/profile");
                  }}>
                    <GlowButton variant="primary" type="submit" className="hidden md:flex px-8 rounded-lg tracking-widest uppercase font-bold text-[11px] shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all">
                      <Terminal className="w-4 h-4 mr-3" />
                      Exit Developer Mode
                    </GlowButton>
                  </form>
                ) : (
                  <GlowButton variant="primary" className="hidden md:flex px-8 rounded-lg tracking-widest uppercase font-bold text-[11px] shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all">
                    <Terminal className="w-4 h-4 mr-3" />
                    Build Architecture
                  </GlowButton>
                )
              }
              className="mb-12 border-b border-white/[0.04] pb-10"
            />
            
            <ProfileProgressCard percentage={completionPercent} />
            
            <div className="space-y-6">
              <PersonalDetailsForm initialData={profile || {}} />
              <ExperienceSection initialItems={experience || []} />
              <EducationSection initialItems={education || []} />
              <ProjectsSection initialItems={projects || []} />
              <SkillsSection initialItems={skills || []} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
