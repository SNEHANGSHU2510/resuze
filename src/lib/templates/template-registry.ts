import React from "react"
import { ResumeTemplate } from "@/types/resume-template"
import { NormalizedResumeData } from "@/types/normalized-resume"
import { ATSClassicTemplate } from "@/components/resume/templates/ats-classic-template"
import { CorporateModernTemplate } from "@/components/resume/templates/corporate-modern-template"
import { ExecutiveGlassTemplate } from "@/components/resume/templates/executive-glass-template"

// Centralized registry for all available deterministic templates
export const TemplateRegistry: Record<string, React.FC<{ data: NormalizedResumeData }>> = {
  "ats-classic": ATSClassicTemplate,
  "corporate-modern": CorporateModernTemplate,
  "executive-glass": ExecutiveGlassTemplate,
}

// Fallback seed data if the database table `resume_templates` is empty.
// In a full production environment, these would be synced/seeded into the DB.
export const TEMPLATE_SEED_DATA: ResumeTemplate[] = [
  {
    id: "template-1",
    name: "ATS Classic",
    slug: "ats-classic",
    description: "The gold standard for parsing. Stripped of all visual formatting that could confuse an Applicant Tracking System.",
    category: "Classic",
    ats_label: "ATS Safe",
    layout: "Single Column",
    preview_image_url: "/placeholder-ats.png",
    recommended_for: "Enterprise applications, government, and strict corporate portals."
  },
  {
    id: "template-2",
    name: "Corporate Modern",
    slug: "corporate-modern",
    description: "A striking two-column design that emphasizes visual hierarchy and modern typographic principles while retaining readability.",
    category: "Modern",
    ats_label: "Hybrid",
    layout: "Two Column",
    preview_image_url: "/placeholder-modern.png",
    recommended_for: "Tech startups, marketing roles, and direct-to-hiring-manager emails."
  },
  {
    id: "template-3",
    name: "Executive Glass",
    slug: "executive-glass",
    description: "Minimalist, sophisticated, and heavily reliant on white space. Built for impact and leadership presentation.",
    category: "Executive",
    ats_label: "Visual Premium",
    layout: "Two Column",
    preview_image_url: "/placeholder-executive.png",
    recommended_for: "C-suite, Director-level, and design-oriented leadership roles."
  }
]
