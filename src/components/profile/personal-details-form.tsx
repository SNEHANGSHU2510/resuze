"use client"

import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { personalDetailsSchema, type PersonalDetailsValues } from "@/lib/validations/profile"
import { SectionCard } from "./section-card"
import { GlowButton } from "@/components/ui/glow-button"
import { createClient } from "@/lib/supabase/client"
import { Check, AlertCircle, Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { premiumInputClasses, premiumLabelClasses } from "./shared-styles"

export function PersonalDetailsForm({ initialData }: { initialData: Partial<PersonalDetailsValues> }) {
  const [status, setStatus] = React.useState<"idle" | "saving" | "success" | "error">("idle")
  const supabase = createClient()
  const router = useRouter()
  
  const methods = useForm<PersonalDetailsValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      headline: initialData?.headline || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      website: initialData?.website || "",
      linkedin_url: initialData?.linkedin_url || "",
      github_url: initialData?.github_url || "",
      location: initialData?.location || "",
      summary: initialData?.summary || "",
    }
  })

  const onSubmit = async (data: PersonalDetailsValues) => {
    try {
      setStatus("saving")
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          headline: data.headline,
          phone: data.phone,
          website: data.website,
          linkedin_url: data.linkedin_url,
          github_url: data.github_url,
          location: data.location,
          summary: data.summary,
        })
        .eq("id", userData.user.id)
      
      if (error) throw error
      
      setStatus("success")
      router.refresh()
      setTimeout(() => setStatus("idle"), 3000)
    } catch (err) {
      console.error(err)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  const { register, formState: { errors, isDirty } } = methods

  return (
    <SectionCard title="Core Vectors" description="Primary identification nodes required for accurate profile rendering.">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1 group">
              <label className={premiumLabelClasses}>First Name</label>
              <input 
                {...register("first_name")} 
                className={premiumInputClasses} 
              />
              {errors.first_name && <span className="text-[11px] font-bold tracking-widest uppercase text-red-500/80 mt-2 block">{errors.first_name.message}</span>}
            </div>
            
            <div className="space-y-1 group">
              <label className={premiumLabelClasses}>Last Name</label>
              <input 
                {...register("last_name")} 
                className={premiumInputClasses} 
              />
              {errors.last_name && <span className="text-[11px] font-bold tracking-widest uppercase text-red-500/80 mt-2 block">{errors.last_name.message}</span>}
            </div>
            
            <div className="space-y-1 lg:col-span-2 group">
              <label className={premiumLabelClasses}>Professional Headline</label>
              <input 
                {...register("headline")} 
                className={premiumInputClasses} 
                placeholder="Chief Architect | Distributed Systems"
              />
            </div>
            
            <div className="space-y-1 group">
              <div className="flex justify-between items-center mb-2">
                 <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/40 block mb-0">Registered Email</label>
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#34d399]/50 px-2 rounded-full border border-[#34d399]/20 bg-[#34d399]/5">Verified</span>
              </div>
              <input 
                {...register("email")} 
                disabled
                className="w-full bg-[#0a1a14] border border-white/[0.03] rounded-xl px-5 py-4 text-[15px] font-medium text-white/30 cursor-not-allowed shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]" 
              />
            </div>
            
            <div className="space-y-1 group">
              <label className={premiumLabelClasses}>Phone Node</label>
              <input 
                {...register("phone")} 
                className={premiumInputClasses} 
              />
            </div>
            
            <div className="space-y-1 group">
              <label className={premiumLabelClasses}>Location Matrix</label>
              <input 
                {...register("location")} 
                className={premiumInputClasses} 
                placeholder="SF Bay Area, CA"
              />
            </div>
            
            <div className="space-y-1 group">
              <label className={premiumLabelClasses}>External Hub</label>
              <input 
                {...register("website")} 
                className={premiumInputClasses} 
                placeholder="https://"
              />
              {errors.website && <span className="text-[11px] font-bold tracking-widest uppercase text-red-500/80 mt-2 block">{errors.website.message}</span>}
            </div>
            
            <div className="space-y-1 group">
              <label className={premiumLabelClasses}>LinkedIn ID</label>
              <input 
                {...register("linkedin_url")} 
                className={premiumInputClasses} 
                placeholder="linkedin.com/in/"
              />
              {errors.linkedin_url && <span className="text-[11px] font-bold tracking-widest uppercase text-red-500/80 mt-2 block">{errors.linkedin_url.message}</span>}
            </div>
            
            <div className="space-y-1 group">
              <label className={premiumLabelClasses}>GitHub Graph</label>
              <input 
                {...register("github_url")} 
                className={premiumInputClasses} 
                placeholder="github.com/"
              />
              {errors.github_url && <span className="text-[11px] font-bold tracking-widest uppercase text-red-500/80 mt-2 block">{errors.github_url.message}</span>}
            </div>
            
            <div className="space-y-1 lg:col-span-2 group">
              <div className="flex justify-between items-end mb-2">
                 <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/40 block mb-0">Executive Summary</label>
                 <span className="text-[10px] text-white/20 font-medium">Rendered directly at the top of ATS protocols</span>
              </div>
              <textarea 
                {...register("summary")} 
                rows={5}
                className={"resize-y min-h-[120px] " + premiumInputClasses} 
                placeholder="Input a high-density abstraction of your overall engineering depth and organizational impact..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4 justify-end pt-4 mt-8 border-t border-white/[0.04]">
            {status === "success" && (
              <span className="flex items-center text-[#34d399] text-[11px] font-bold tracking-[0.2em] uppercase animate-in fade-in zoom-in duration-300">
                <Check className="w-3.5 h-3.5 mr-2" />
                State Saved
              </span>
            )}
            {status === "error" && (
              <span className="flex items-center text-red-500 text-[11px] font-bold tracking-[0.2em] uppercase animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-3.5 h-3.5 mr-2" />
                Failure
              </span>
            )}
            
            <GlowButton type="submit" disabled={status === "saving" || (!isDirty && status === "idle")} className="px-8 rounded-lg shadow-xl shadow-black">
              {status === "saving" ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Transmitting...</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5 mr-2 opacity-50" /> Update State</>
              )}
            </GlowButton>
          </div>
          
        </form>
      </FormProvider>
    </SectionCard>
  )
}
