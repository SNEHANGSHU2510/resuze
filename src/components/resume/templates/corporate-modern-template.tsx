import React from "react"
import { NormalizedResumeData } from "@/types/normalized-resume"

const formatDate = (dateString?: string) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function CorporateModernTemplate({ data }: { data: NormalizedResumeData }) {
  const { personal, experience, education, projects, skills } = data

  return (
    <div className="bg-white text-slate-800 p-0 font-sans max-w-[800px] mx-auto text-[10.5pt] min-h-[1056px] shadow-sm flex flex-col relative overflow-hidden">
      {/* Heavy modern left-aligned header */}
      <header className="bg-slate-900 text-white p-8 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-blue-400 uppercase">{personal.first_name} <span className="text-white">{personal.last_name}</span></h1>
        {personal.headline && <p className="text-lg text-slate-300 font-medium mb-4">{personal.headline}</p>}
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400 font-medium tracking-wide">
          {personal.location && <span>{personal.location}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.email && <span>{personal.email}</span>}
          {personal.linkedin_url && <span>{personal.linkedin_url.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      <div className="flex px-8 pb-8 gap-8">
        {/* Main Column */}
        <div className="w-2/3 pr-4">
          {personal.summary && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider mb-2 flex items-center gap-2">
                <span className="w-4 h-px bg-blue-500 inline-block"></span> Summary
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">{personal.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-blue-500 inline-block"></span> Experience
              </h2>
              <div className="space-y-5">
                {experience.map(exp => (
                  <div key={exp.id} className="relative">
                    <div className="absolute -left-3 top-2 w-1.5 h-1.5 rounded-full bg-blue-500 hidden md:block"></div>
                    <h3 className="font-bold text-slate-900 text-sm leading-none mb-1">{exp.title}</h3>
                    <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                      <span>{exp.company} {exp.location && `| ${exp.location}`}</span>
                      <span>{formatDate(exp.start_date)} – {exp.current ? 'Present' : formatDate(exp.end_date)}</span>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">
                        {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="mb-6">
               <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-blue-500 inline-block"></span> Projects
              </h2>
              <div className="space-y-4">
                {projects.map(proj => (
                  <div key={proj.id}>
                    <h3 className="font-bold text-slate-900 text-sm leading-none mb-1">{proj.name}</h3>
                    <div className="text-xs text-slate-500 mb-2">{proj.role}</div>
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">
                        {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="w-1/3">
          {skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider mb-4 border-b border-slate-200 pb-2">Expertise</h2>
              <div className="flex flex-col gap-2">
                {skills.map(skill => (
                  <div key={skill.id} className="text-sm bg-slate-50 text-slate-700 px-3 py-1.5 border border-slate-100 rounded">
                    <span className="font-semibold block">{skill.name}</span>
                    <span className="text-xs text-slate-400">{skill.category}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider mb-4 border-b border-slate-200 pb-2">Education</h2>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id} className="text-sm">
                    <h3 className="font-bold text-slate-800 leading-snug">{edu.degree}</h3>
                    <div className="text-slate-600">{edu.field_of_study}</div>
                    <div className="text-xs text-slate-500 mt-1">{edu.institution}</div>
                    <div className="text-[10px] text-slate-400 uppercase mt-0.5 tracking-wide">
                      {formatDate(edu.start_date)} – {edu.current ? 'Present' : formatDate(edu.end_date)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
