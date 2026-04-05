import React from "react"
import { NormalizedResumeData } from "@/types/normalized-resume"

const formatDate = (dateString?: string) => {
  if (!dateString) return ""
  return new Date(dateString).getFullYear().toString()
}

export function ExecutiveGlassTemplate({ data }: { data: NormalizedResumeData }) {
  const { personal, experience, education, projects, skills } = data

  return (
    <div className="bg-[#FAF9F6] text-zinc-900 p-10 font-sans max-w-[800px] mx-auto text-[10pt] min-h-[1056px] shadow-sm relative overflow-hidden box-border border-t-8 border-zinc-900 border-b-8">
      {/* Minimalist Centered Header */}
      <header className="text-center mb-10 pb-6 border-b border-zinc-200">
        <h1 className="text-4xl font-light tracking-[0.2em] uppercase mb-3 text-zinc-800">
          {personal.first_name} <span className="font-semibold">{personal.last_name}</span>
        </h1>
        {personal.headline && <p className="text-sm uppercase tracking-widest text-zinc-500 mb-4">{personal.headline}</p>}
        <div className="flex justify-center flex-wrap gap-4 text-xs tracking-tight text-zinc-600">
          <span>{personal.location}</span>
          <span>{personal.email}</span>
          <span>{personal.phone}</span>
        </div>
      </header>

      {personal.summary && (
        <section className="mb-8 max-w-2xl mx-auto text-center">
          <p className="text-sm leading-relaxed text-zinc-700 font-serif italic text-justify">
            "{personal.summary}"
          </p>
        </section>
      )}

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
          {experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Experience</h2>
              <div className="space-y-6">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-zinc-900 text-sm uppercase">{exp.company}</h3>
                      <div className="text-xs text-zinc-500 font-mono">
                        {formatDate(exp.start_date)} — {exp.current ? 'PRESENT' : formatDate(exp.end_date)}
                      </div>
                    </div>
                    <p className="text-xs font-medium text-zinc-600 mb-2">{exp.title}</p>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-none text-sm space-y-1.5 text-zinc-700">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-zinc-300">-</span>
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Key Initiatives</h2>
              <div className="space-y-5">
                {projects.map(proj => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-zinc-900 text-sm uppercase">{proj.name}</h3>
                      <div className="text-xs text-zinc-500 font-mono">
                        {formatDate(proj.start_date)}
                      </div>
                    </div>
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-none text-sm space-y-1.5 text-zinc-700 mt-2">
                        {proj.bullets.map((b, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-zinc-300">-</span>
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-4 border-l border-zinc-100 pl-6">
          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Education</h2>
              <div className="space-y-5">
                {education.map(edu => (
                  <div key={edu.id} className="text-sm">
                    <h3 className="font-semibold text-zinc-900">{edu.degree}</h3>
                    <div className="text-zinc-600 text-xs mt-1 leading-snug">{edu.institution}</div>
                    <div className="text-xs text-zinc-400 font-mono mt-1">
                      {formatDate(edu.end_date) || 'Present'}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
             <section className="mb-8">
               <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Expertise</h2>
               <div className="flex flex-col gap-2">
                 {skills.map(s => (
                   <div key={s.id} className="text-xs text-zinc-700 border-b border-zinc-100 pb-1">
                     {s.name}
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
