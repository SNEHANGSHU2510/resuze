import { GlassPanel } from "@/components/ui/glass-panel"
import { GlowButton } from "@/components/ui/glow-button"
import Link from "next/link"
import { AlertCircle, ArrowRight } from "lucide-react"

interface ProfileGuardProps {
  missingFields: string[]
  completionPercent: number
}

/**
 * Rendered when profile data is insufficient for builder/JD/ATS flows.
 * Displays what's missing and links back to the profile page.
 */
export function ProfileGuard({ missingFields, completionPercent }: ProfileGuardProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <GlassPanel className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-400/10 flex items-center justify-center mx-auto border border-amber-400/20 mb-4">
          <AlertCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-lg text-white font-bold mb-2">Complete Your Profile First</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your profile is {completionPercent}% complete. To use this feature, please fill in the following:
        </p>
        <ul className="text-left space-y-1.5 mb-6 px-4">
          {missingFields.map((field) => (
            <li key={field} className="text-sm text-amber-300/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              {field}
            </li>
          ))}
        </ul>
        <Link href="/app/profile">
          <GlowButton className="w-full">
            Go to Profile <ArrowRight className="w-4 h-4 ml-2" />
          </GlowButton>
        </Link>
      </GlassPanel>
    </div>
  )
}
