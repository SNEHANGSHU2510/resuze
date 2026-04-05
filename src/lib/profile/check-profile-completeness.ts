import { NormalizedResumeData } from "@/types/normalized-resume"

export interface ProfileCheck {
  complete: boolean
  missingFields: string[]
  completionPercent: number
}

/**
 * Checks whether a user's profile has enough data to proceed with
 * resume building or JD tailoring.
 */
export function checkProfileCompleteness(data: NormalizedResumeData): ProfileCheck {
  const missing: string[] = []

  if (!data.personal.first_name?.trim()) missing.push("First name")
  if (!data.personal.last_name?.trim()) missing.push("Last name")
  if (!data.personal.email?.trim()) missing.push("Email")
  if (!data.personal.phone?.trim()) missing.push("Phone")
  if (data.experience.length === 0) missing.push("At least one experience entry")
  if (data.skills.length === 0) missing.push("At least one skill")

  const totalChecks = 6
  const passed = totalChecks - missing.length
  const completionPercent = Math.round((passed / totalChecks) * 100)

  return {
    complete: missing.length === 0,
    missingFields: missing,
    completionPercent,
  }
}
