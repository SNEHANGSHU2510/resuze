"use client"

import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { experienceSchema, type ExperienceValues } from "@/lib/validations/profile"
import { SectionCard } from "./section-card"
import { RepeatableItemList } from "./repeatable-item-list"
import { GlowButton } from "@/components/ui/glow-button"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Briefcase, Loader2, Link2, SearchCode } from "lucide-react"
import { useRouter } from "next/navigation"
import { BulletListEditor } from "./bullet-list-editor"
import { premiumInputClasses, premiumLabelClasses } from "./shared-styles"

export function ExperienceSection({ initialItems }: { initialItems: ExperienceValues[] }) {
  const [items, setItems] = React.useState<ExperienceValues[]>(initialItems)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("experience").delete().eq("id", id)
    if (error) throw error
    setItems((prev) => prev.filter((item) => item.id !== id))
    router.refresh()
  }

  const handleSave = async (data: ExperienceValues, onSuccess: () => void) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Not authenticated")

      const payload = {
        user_id: userData.user.id,
        company: data.company,
        title: data.title,
        location: data.location || null,
        start_date: data.start_date || null,
        end_date: data.current ? null : (data.end_date || null),
        current: data.current,
        description: data.description || null,
        bullets: (data.bullets || []).filter((b) => b.trim() !== ""),
      }

      if (data.id) {
        const { data: updatedData, error } = await supabase
          .from("experience")
          .update(payload)
          .eq("id", data.id)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => prev.map((item) => (item.id === updatedData.id ? updatedData : item)))
      } else {
        const { data: insertedData, error } = await supabase
          .from("experience")
          .insert(payload)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => [...prev, insertedData])
      }
      onSuccess()
      router.refresh()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <SectionCard title="Experience" description="Highlight your professional career history and achievements.">
      <RepeatableItemList<ExperienceValues>
        items={items}
        onDelete={handleDelete}
        emptyMessage="No experience added yet. Add your work history here."
        addButtonLabel="Add Experience"
        renderItem={(item) => (
          <div className="flex items-start gap-5 p-5 bg-[#0a1a14] border border-white/[0.05] rounded-[1.5rem] group hover:border-[#34d399]/20 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 shrink-0 relative z-10">
              <SearchCode className="h-5 w-5 text-[#34d399]/50 group-hover:text-[#34d399] transition-colors" />
            </div>
            <div className="flex-1 relative z-10 pt-1">
              <h4 className="text-[17px] font-medium text-white tracking-tight">{item.title}</h4>
              <p className="text-[13px] font-normal text-white/50 mt-1">{item.company} {item.location ? `• ${item.location}` : ""}</p>
              <div className="text-[11px] font-bold tracking-widest uppercase text-[#34d399]/50 mt-2 mb-4">
                {item.start_date ? new Date(item.start_date).toISOString().substring(0, 7) : "N/A"} - 
                {item.current ? " Present" : item.end_date ? ` ${new Date(item.end_date).toISOString().substring(0, 7)}` : " N/A"}
              </div>
              {item.bullets && item.bullets.length > 0 && (
                <ul className="space-y-2 mt-2">
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-[13px] text-white/60 flex items-start leading-relaxed font-medium">
                      <span className="text-[#34d399] opacity-40 mr-3 mt-1.5 w-1 h-1 rounded-full shrink-0 shadow-[0_0_5px_#34d399]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        renderForm={(defaultValues, onSuccess, onCancel) => {
           return <ExperienceForm defaultValues={defaultValues} onSubmit={(data) => handleSave(data, onSuccess)} onCancel={onCancel} />
        }}
      />
    </SectionCard>
  )
}

function ExperienceForm({ defaultValues, onSubmit, onCancel }: { 
  defaultValues: Partial<ExperienceValues> | null, 
  onSubmit: (data: ExperienceValues) => Promise<void>, 
  onCancel: () => void 
}) {
  const methods = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: defaultValues || {
      company: "",
      title: "",
      location: "",
      start_date: "",
      end_date: "",
      current: false,
      bullets: [""],
    }
  })

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = methods
  const isCurrent = watch("current")

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div className="space-y-1">
            <label className={premiumLabelClasses}>Company</label>
            <input 
              {...register("company")} 
              className={premiumInputClasses} 
              placeholder="e.g. Acme Corp"
            />
            {errors.company && <span className="text-[11px] font-bold tracking-widest uppercase text-red-500/80 mt-2 block">{errors.company.message}</span>}
          </div>
          
          <div className="space-y-1">
            <label className={premiumLabelClasses}>Job Title</label>
            <input 
              {...register("title")} 
              className={premiumInputClasses} 
              placeholder="e.g. Senior Neural Engineer"
            />
            {errors.title && <span className="text-xs text-destructive">{errors.title.message}</span>}
          </div>

          <div className="space-y-1 pt-[1.75rem]">
            <div className="flex items-center space-x-3 bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl">
              <input
                type="checkbox"
                id={`current-exp-${defaultValues?.id || "new"}`}
                checked={!!isCurrent}
                onChange={(e) => methods.setValue("current", e.target.checked, { shouldDirty: true })}
                className="rounded border-white/10 bg-black/50 text-[#34d399] focus:ring-[#34d399]/50 cursor-pointer accent-[#34d399] w-4 h-4"
              />
              <label htmlFor={`current-exp-${defaultValues?.id || "new"}`} className="text-[12px] font-medium text-white/80 cursor-pointer select-none">
                I currently work here
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className={premiumLabelClasses}>Location</label>
            <input 
              {...register("location")} 
              className={premiumInputClasses} 
              placeholder="City, Country"
            />
          </div>

          <div className="space-y-1">
            <label className={premiumLabelClasses}>Start Date</label>
            <input 
              type="month"
              {...register("start_date")} 
              className={premiumInputClasses + " [color-scheme:dark]"} 
            />
          </div>

          <div className="space-y-1">
            <label className={premiumLabelClasses}>End Date</label>
            <input 
              type="month"
              {...register("end_date")} 
              disabled={isCurrent}
              className={premiumInputClasses + " disabled:opacity-50 [color-scheme:dark]"} 
            />
          </div>
        </div>

        <div className="space-y-2 mt-4 pt-4 border-t border-white/[0.05]">
           <label className={premiumLabelClasses}>Highlights & Achievements</label>
           <p className="text-[12px] font-medium text-white/30 mb-4 tracking-wide">Use Action + Metric + Result to stand out to ATS scoring algorithms.</p>
           <BulletListEditor name="bullets" />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
          <GlowButton type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {defaultValues ? "Save Changes" : "Add Experience"}
          </GlowButton>
        </div>
      </form>
    </FormProvider>
  )
}
