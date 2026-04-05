"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Eye, Search, Inbox, ShieldCheck, MapPin, Calendar, Zap, Briefcase, BookOpen, Cpu, Settings2 } from "lucide-react"
import Link from "next/link"
import type { PersonalDetailsValues, EducationValues, ExperienceValues, ProjectValues, SkillValues } from "@/lib/validations/profile"

interface ProfessionalDashboardProps {
  profile: Partial<PersonalDetailsValues>
  education: EducationValues[]
  experience: ExperienceValues[]
  projects: ProjectValues[]
  skills: SkillValues[]
  completionPercent: number
}

export function ProfessionalDashboard({
  profile,
  education,
  experience,
  projects,
  skills,
  completionPercent
}: ProfessionalDashboardProps) {

  const name = profile.first_name ? `${profile.first_name} ${profile.last_name || ""}`.trim() : "Unknown User"
  const initials = profile.first_name ? profile.first_name[0] : "U"

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-16">
      
      {/* Top Profile Card */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0a1a14]/80 backdrop-blur-2xl border border-white/[0.05] p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-8 items-center md:items-start group hover:border-white/10 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-[#34d399]/5 via-transparent to-[#059669]/5 opacity-50" />
        
        <div className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-white/10 bg-black/60 shadow-inner flex flex-col items-center justify-center overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          <span className="text-4xl sm:text-5xl font-light text-white z-20 mix-blend-screen">{initials}</span>
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[#34d399]/40 shadow-[0_0_15px_#34d399] z-20" />
        </div>

        <div className="flex-1 relative z-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-start w-full">
           <div>
             <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
               <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">{name}</h1>
               <div className="p-1 rounded-full bg-[#34d399]/10 border border-[#34d399]/20">
                 <ShieldCheck className="w-4 h-4 text-[#34d399]" />
               </div>
             </div>
             <p className="text-[#a1a1aa] font-medium text-[15px] sm:text-[17px] mb-4 tracking-wide">{profile.headline || "Systems Engineer"}</p>
             
             <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-xs font-bold uppercase tracking-widest text-white/40">
                {profile.location && (
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-white/50" /> {profile.location}</span>
                )}
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-white/50" /> Architecture V.1</span>
             </div>
           </div>

           <div className="mt-6 md:mt-0 flex items-center gap-3">
             <Link 
               href="?mode=edit" 
               className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-white transition-all active:scale-95"
             >
               <Settings2 className="w-4 h-4" /> Edit Profile
             </Link>
             <Link 
               href="/app/resume-builder" 
               className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#34d399] hover:bg-[#34d399]/90 text-black text-[11px] font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] active:scale-95"
             >
               <Zap className="w-4 h-4" /> Build CV
             </Link>
           </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         {[
           { label: "Profile Views", value: "1,284", icon: Eye, color: "text-[#34d399]", border: "border-[#34d399]/15" },
           { label: "ATS Scans", value: "45", icon: Search, color: "text-[#22d3ee]", border: "border-[#22d3ee]/15" },
           { label: "Interview Invites", value: "12", icon: Inbox, color: "text-[#f59e0b]", border: "border-[#f59e0b]/15" }
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 * i }}
             className={`relative overflow-hidden rounded-[1.5rem] bg-[#0a1a14] border ${stat.border} p-6 group hover:bg-[#0d2018] transition-colors`}
           >
             <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-25 transition-opacity ${stat.color}`}>
                <stat.icon className="w-16 h-16" />
             </div>
             <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 block mb-2">{stat.label}</span>
             <div className="flex items-end gap-3">
               <span className="text-4xl text-white font-light tracking-tighter">{stat.value}</span>
               <span className={`text-[11px] font-bold tracking-widest uppercase pb-1.5 ${stat.color}`}>+12.5%</span>
             </div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* Experience Block */}
           <div className="bg-[#0a1a14] border border-white/[0.05] rounded-[1.5rem] p-6 lg:p-8">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-white/[0.05] pb-6">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-[#34d399]/10 rounded-lg border border-[#34d399]/20">
                   <Briefcase className="w-4 h-4 text-[#34d399]" />
                 </div>
                 <h2 className="text-[15px] font-medium text-white tracking-wide">Professional Experience</h2>
               </div>
               <Link href="?mode=edit" className="text-[11px] font-bold text-[#34d399] uppercase tracking-widest hover:text-white transition-colors">Add Position</Link>
             </div>

             <div className="space-y-8 relative">
                <div className="absolute top-0 bottom-0 left-[27px] w-px bg-white/[0.05]" />
                
                {experience.length === 0 ? (
                  <p className="text-[13px] text-white/30 px-6 py-4">No experience logged.</p>
                ) : experience.map((exp, i) => (
                  <div key={exp.id || i} className="relative z-10 pl-16">
                     <div className="absolute left-[24px] top-1.5 w-[7px] h-[7px] rounded-full bg-[#34d399] shadow-[0_0_10px_#34d399]" />
                     <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                       <h3 className="text-[16px] font-medium text-white">{exp.title}</h3>
                       <span className="text-[11px] font-bold uppercase tracking-widest text-white/40 shrink-0">
                         {exp.start_date ? new Date(exp.start_date).getFullYear() : ""} — {exp.current ? "Present" : (exp.end_date ? new Date(exp.end_date).getFullYear() : "")}
                       </span>
                     </div>
                     <p className="text-[13px] font-medium text-[#34d399]/70 mb-4">{exp.company}</p>
                     
                     {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="space-y-2 mb-4">
                          {exp.bullets.map((b, idx) => (
                            <li key={idx} className="text-[13px] text-white/60 leading-relaxed font-medium">· {b}</li>
                          ))}
                        </ul>
                     )}
                  </div>
                ))}
             </div>
           </div>

           {/* Education Block */}
           <div className="bg-[#0a1a14] border border-white/[0.05] rounded-[1.5rem] p-6 lg:p-8">
             <div className="flex items-center gap-3 mb-8 border-b border-white/[0.05] pb-6">
                 <div className="p-2 bg-[#059669]/10 rounded-lg border border-[#059669]/20">
                   <BookOpen className="w-4 h-4 text-[#059669]" />
                 </div>
                 <h2 className="text-[15px] font-medium text-white tracking-wide">Education & Certifications</h2>
             </div>
             
             <div className="space-y-6">
                {education.length === 0 ? (
                  <p className="text-[13px] text-white/30 px-2">No education logged.</p>
                ) : education.map((edu, i) => (
                  <div key={edu.id || i} className="flex flex-col sm:flex-row justify-between items-start gap-2 p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] transition-colors">
                     <div>
                       <h3 className="text-[15px] font-medium text-white">{edu.institution}</h3>
                       <p className="text-[12px] font-medium text-[#059669]/70 mt-1">{edu.degree} {edu.field_of_study ? `· ${edu.field_of_study}` : ""}</p>
                     </div>
                     <span className="text-[11px] font-bold uppercase tracking-widest text-white/40 shrink-0">
                        {edu.start_date ? new Date(edu.start_date).getFullYear() : ""} — {edu.current ? "Present" : (edu.end_date ? new Date(edu.end_date).getFullYear() : "")}
                     </span>
                  </div>
                ))}
             </div>
           </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
           {/* Key Skills */}
           <div className="bg-[#0a1a14] border border-white/[0.05] rounded-[1.5rem] p-6 lg:p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#34d399]/5 blur-[80px] -z-10 group-hover:bg-[#34d399]/8 transition-colors duration-1000" />
             
             <div className="flex items-center gap-3 mb-8">
                 <div className="p-2 bg-[#f59e0b]/10 rounded-lg border border-[#f59e0b]/20">
                   <Cpu className="w-4 h-4 text-[#f59e0b]" />
                 </div>
                 <h2 className="text-[15px] font-medium text-white tracking-wide">Key Skills</h2>
             </div>

             <div className="space-y-6">
                 {skills.length === 0 ? (
                    <p className="text-[13px] text-white/30 px-2">No skills logged.</p>
                 ) : skills.map((skill, i) => {
                    const randomProgress = [95, 88, 72, 65, 90][i % 5]
                    return (
                      <div key={skill.id || i} className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[11px] font-bold tracking-widest uppercase text-white">{skill.name}</span>
                          <span className="text-[11px] font-bold text-[#34d399]">{randomProgress}%</span>
                        </div>
                        <div className="h-1 w-full bg-black border border-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${randomProgress}%` }}
                             transition={{ duration: 1.5, delay: 0.1 * i }}
                             className="h-full bg-[#34d399] shadow-[0_0_10px_#34d399]" 
                           />
                        </div>
                      </div>
                    )
                 })}
             </div>
             
             {skills.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-white/[0.05]">
                  {skills.slice(0, 6).map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg border border-white/[0.05] bg-white/[0.02] text-[11px] font-medium text-white/50 whitespace-nowrap">
                      {skill.name}
                    </span>
                  ))}
                </div>
             )}
           </div>

           {/* AI Optimization Status */}
           <div className="bg-[#0a1a14] border border-white/[0.05] rounded-[1.5rem] p-6 lg:p-8 relative overflow-hidden group border-t-4 border-t-[#34d399]">
             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#34d399]/5 to-transparent pointer-events-none" />
             <div className="w-12 h-12 rounded-xl bg-[#34d399]/10 border border-[#34d399]/20 flex items-center justify-center mb-6">
               <ShieldCheck className="w-6 h-6 text-[#34d399]" />
             </div>
             <h3 className="text-[18px] font-medium text-white tracking-tight mb-2">AI Optimization</h3>
             <p className="text-sm font-medium text-white/50 leading-relaxed mb-6">
               Your architecture is ready for {completionPercent}% of high-end tech roles. Use AI to tailor it for specific job listings now.
             </p>
             <Link href="/app/generate-from-jd" className="w-full flex items-center justify-center py-3 bg-white text-black rounded-lg text-[12px] font-bold uppercase tracking-widest hover:bg-white/90 transition-colors">
               Tailor Now
             </Link>
           </div>
        </div>

      </div>
    </div>
  )
}
