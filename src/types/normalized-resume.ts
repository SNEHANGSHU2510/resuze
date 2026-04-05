export interface NormalizedPersonalDetails {
  first_name: string
  last_name: string
  headline: string
  email: string
  phone: string
  location: string
  website: string
  linkedin_url: string
  github_url: string
  summary: string
}

export interface NormalizedEducation {
  id: string
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date: string
  current: boolean
  description: string
}

export interface NormalizedExperience {
  id: string
  company: string
  title: string
  location: string
  start_date: string
  end_date: string
  current: boolean
  description: string
  bullets: string[]
}

export interface NormalizedProject {
  id: string
  name: string
  role: string
  url: string
  start_date: string
  end_date: string
  description: string
  bullets: string[]
}

export interface NormalizedSkill {
  id: string
  name: string
  category: string
  level: string
}

export interface NormalizedResumeData {
  personal: NormalizedPersonalDetails
  education: NormalizedEducation[]
  experience: NormalizedExperience[]
  projects: NormalizedProject[]
  skills: NormalizedSkill[]
}
