import * as z from "zod"

export const personalDetailsSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  headline: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  linkedin_url: z.string().optional().nullable(),
  github_url: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
})
export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field_of_study: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  current: z.boolean(),
  description: z.string().optional().nullable(),
})
export type EducationValues = z.infer<typeof educationSchema>

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Title is required"),
  location: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  current: z.boolean(),
  description: z.string().optional().nullable(),
  bullets: z.array(z.string()),
})
export type ExperienceValues = z.infer<typeof experienceSchema>

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  role: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  bullets: z.array(z.string()),
})
export type ProjectValues = z.infer<typeof projectSchema>

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill is required"),
  category: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
})
export type SkillValues = z.infer<typeof skillSchema>
