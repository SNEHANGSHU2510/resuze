"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { educationSchema, type EducationValues } from "@/lib/validations/profile"
import { SectionCard } from "./section-card"
import { RepeatableItemList } from "./repeatable-item-list"
import { GlowButton } from "@/components/ui/glow-button"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { GraduationCap, Loader2, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { premiumInputClasses, premiumLabelClasses } from "./shared-styles"

export function EducationSection({ initialItems }: { initialItems: EducationValues[] }) {
  const [items, setItems] = React.useState<EducationValues[]>(initialItems)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("education").delete().eq("id", id)
    if (error) {
      console.error(error)
      throw error
    }
    setItems((prev) => prev.filter((item) => item.id !== id))
    router.refresh()
  }

  const handleSave = async (data: EducationValues, onSuccess: () => void) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Not authenticated")

      const payload = {
        user_id: userData.user.id,
        institution: data.institution,
        degree: data.degree,
        field_of_study: data.field_of_study || null,
        start_date: data.start_date || null,
        end_date: data.current ? null : (data.end_date || null),
        current: data.current,
        description: data.description || null,
      }

      if (data.id) {
        // Update
        const { data: updatedData, error } = await supabase
          .from("education")
          .update(payload)
          .eq("id", data.id)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => prev.map((item) => (item.id === updatedData.id ? updatedData : item)))
      } else {
        // Insert
        const { data: insertedData, error } = await supabase
          .from("education")
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
      // handling error state could go here
    }
  }

  return (
    <SectionCard 
      title="Education" 
      description="Degrees, certifications, and academic background."
    >
      <RepeatableItemList<EducationValues>
        items={items}
        onDelete={handleDelete}
        emptyMessage="No education added yet. Add degrees or certifications here."
        addButtonLabel="Add Education"
        renderItem={(item) => (
          <div className="flex items-start gap-5 p-5 bg-[#0a1a14] border border-white/[0.05] rounded-[1.5rem] group hover:border-[#059669]/20 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 shrink-0 relative z-10">
              <BookOpen className="h-5 w-5 text-[#059669]/50 group-hover:text-[#059669] transition-colors" />
            </div>
            <div className="flex-1 relative z-10 pt-1">
              <h4 className="text-[17px] font-medium text-white tracking-tight">{item.institution}</h4>
              <p className="text-[13px] font-normal text-white/50 mt-1">{item.degree} {item.field_of_study ? `• ${item.field_of_study}` : ""}</p>
              <div className="text-[11px] font-bold tracking-widest uppercase text-[#059669]/50 mt-2 mb-2">
                {item.start_date ? new Date(item.start_date).getFullYear() : "N/A"} - 
                {item.current ? " Present" : item.end_date ? ` ${new Date(item.end_date).getFullYear()}` : " N/A"}
              </div>
            </div>
          </div>
        )}
        renderForm={(defaultValues, onSuccess, onCancel) => {
          return <EducationForm defaultValues={defaultValues} onSubmit={(data) => handleSave(data, onSuccess)} onCancel={onCancel} />
        }}
      />
    </SectionCard>
  )
}

function EducationForm({ 
  defaultValues, 
  onSubmit, 
  onCancel 
}: { 
  defaultValues: Partial<EducationValues> | null, 
  onSubmit: (data: EducationValues) => Promise<void>, 
  onCancel: () => void 
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: defaultValues || {
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
    }
  })

  const isCurrent = watch("current")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="space-y-1">
          <label className={premiumLabelClasses}>Institution</label>
          <input 
            {...register("institution")} 
            className={premiumInputClasses} 
          />
          {errors.institution && <span className="text-[11px] font-bold tracking-widest uppercase text-red-500/80 mt-2 block">{errors.institution.message}</span>}
        </div>
        
        <div className="space-y-1">
          <label className={premiumLabelClasses}>Degree</label>
          <input 
            {...register("degree")} 
            className={premiumInputClasses} 
            placeholder="e.g. Master of Science"
          />
          {errors.degree && <span className="text-[11px] font-bold tracking-widest uppercase text-red-500/80 mt-2 block">{errors.degree.message}</span>}
        </div>

        <div className="space-y-1">
          <label className={premiumLabelClasses}>Field of Study</label>
          <input 
            {...register("field_of_study")} 
            className={premiumInputClasses} 
            placeholder="e.g. Computer Science"
          />
        </div>

        <div className="space-y-1 pt-[1.75rem]">
          <div className="flex items-center space-x-3 bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl">
          <input
            type="checkbox"
            id={`current-${defaultValues?.id || "new"}`}
            checked={!!isCurrent}
            onChange={(e) => setValue("current", e.target.checked, { shouldDirty: true })}
            className="rounded border-white/10 bg-black/50 text-[#059669] focus:ring-[#059669]/50 cursor-pointer accent-[#059669] w-4 h-4"
          />
          <label htmlFor={`current-${defaultValues?.id || "new"}`} className="text-[12px] font-medium text-white/80 cursor-pointer select-none">
            I am currently studying here
          </label>
        </div>
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
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <GlowButton type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {defaultValues ? "Save Changes" : "Add Education"}
        </GlowButton>
      </div>
    </form>
  )
}
