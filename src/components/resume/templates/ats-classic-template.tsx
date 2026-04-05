import React from "react"
import { NormalizedResumeData } from "@/types/normalized-resume"

const formatDate = (dateString?: string) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function ATSClassicTemplate({ data }: { data: NormalizedResumeData }) {
  const { personal, experience, education, projects, skills } = data

  return (
    <div className="bg-white text-black p-8 font-serif leading-relaxed max-w-[800px] mx-auto text-[11pt] min-h-[1056px] shadow-sm">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">{personal.first_name} {personal.last_name}</h1>
        <div className="text-sm">
          {personal.location} | {personal.phone} | {personal.email}
          {personal.linkedin_url && ` | ${personal.linkedin_url.replace(/^https?:\/\//, '')}`}
        </div>
      </header>

      {personal.summary && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Professional Summary</h2>
          <p className="text-sm">{personal.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Experience</h2>
          {experience.map(exp => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between font-bold text-sm">
                <span>{exp.title}</span>
                <span>{formatDate(exp.start_date)} – {exp.current ? 'Present' : formatDate(exp.end_date)}</span>
              </div>
              <div className="flex justify-between text-sm italic mb-1">
                <span>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-disc list-outside ml-4 text-sm space-y-0.5">
                  {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Projects</h2>
          {projects.map(proj => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between font-bold text-sm">
                <span>{proj.name} {proj.role ? `| ${proj.role}` : ''}</span>
                <span>{formatDate(proj.start_date)} – {proj.end_date ? formatDate(proj.end_date) : 'Present'}</span>
              </div>
              {proj.bullets && proj.bullets.length > 0 && (
                <ul className="list-disc list-outside ml-4 text-sm mt-1 space-y-0.5">
                  {proj.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Education</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-2 text-sm">
              <div className="flex justify-between font-bold">
                <span>{edu.institution}</span>
                <span>{formatDate(edu.start_date)} – {edu.current ? 'Present' : formatDate(edu.end_date)}</span>
              </div>
              <div>{edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}</div>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b border-black pb-1 mb-2">Skills</h2>
          <div className="text-sm">
            {/* Group skills by category if preferred, or just list them. We'll list them simply for ATS */}
            {skills.map(s => s.name).join(' • ')}
          </div>
        </section>
      )}
    </div>
  )
}
