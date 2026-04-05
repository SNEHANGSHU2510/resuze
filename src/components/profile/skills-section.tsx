"use client"

import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { skillSchema, type SkillValues } from "@/lib/validations/profile"
import { SectionCard } from "./section-card"
import { RepeatableItemList } from "./repeatable-item-list"
import { GlowButton } from "@/components/ui/glow-button"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Sparkles, Loader2, Cpu } from "lucide-react"
import { useRouter } from "next/navigation"
import { premiumInputClasses, premiumLabelClasses } from "./shared-styles"

export function SkillsSection({ initialItems }: { initialItems: SkillValues[] }) {
  const [items, setItems] = React.useState<SkillValues[]>(initialItems)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id)
    if (error) throw error
    setItems((prev) => prev.filter((item) => item.id !== id))
    router.refresh()
  }

  const handleSave = async (data: SkillValues, onSuccess: () => void) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Not authenticated")

      const payload = {
        user_id: userData.user.id,
        name: data.name,
        category: data.category,
        level: data.level,
      }

      if (data.id) {
        const { data: updatedData, error } = await supabase
          .from("skills")
          .update(payload)
          .eq("id", data.id)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => prev.map((item) => (item.id === updatedData.id ? updatedData : item)))
      } else {
        const { data: insertedData, error } = await supabase
          .from("skills")
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

  // To display nicely, we'll just show them as a pill list if not editing
  return (
    <SectionCard title="Skills" description="Technical and soft skills.">
      <RepeatableItemList<SkillValues>
        items={items}
        onDelete={handleDelete}
        emptyMessage="Add specific technical skills and tools."
        addButtonLabel="Add Skill"
        renderItem={(item) => (
          <div className="flex items-center gap-4 py-3 px-4 bg-[#0a1a14] border border-white/[0.05] rounded-[1rem] group hover:border-[#f59e0b]/20 transition-all duration-300 relative overflow-hidden h-[60px]">
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 relative z-10">
               <Cpu className="h-4 w-4 text-[#f59e0b]/50 group-hover:text-[#f59e0b] transition-colors" />
            </div>
            
            <div className="flex-1 flex justify-between items-center relative z-10 w-full">
              <div className="flex items-center gap-3">
                <span className="font-medium text-[15px] text-white tracking-wide">{item.name}</span>
                {item.level && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b]/80 px-2 py-0.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20 hidden sm:block">
                    {item.level}
                  </span>
                )}
              </div>
              {item.category && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 truncate">
                  {item.category}
                </span>
              )}
            </div>
          </div>
        )}
        renderForm={(defaultValues, onSuccess, onCancel) => {
           return <SkillForm defaultValues={defaultValues} onSubmit={(data) => handleSave(data, onSuccess)} onCancel={onCancel} />
        }}
      />
    </SectionCard>
  )
}

function SkillForm({ defaultValues, onSubmit, onCancel }: { 
  defaultValues: Partial<SkillValues> | null, 
  onSubmit: (data: SkillValues) => Promise<void>, 
  onCancel: () => void 
}) {
  const methods = useForm<SkillValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: defaultValues || {
      name: "",
      category: "Core",
      level: "Intermediate",
    }
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = methods

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
        <div className="space-y-1">
          <label className={premiumLabelClasses}>Skill Node</label>
          <input 
            {...register("name")} 
            className={premiumInputClasses} 
            placeholder="e.g. React.js"
          />
          {errors.name && <span className="text-[11px] font-bold tracking-widest uppercase text-red-500/80 mt-2 block">{errors.name.message}</span>}
        </div>
        
        <div className="space-y-1">
          <label className={premiumLabelClasses}>Category</label>
          <select 
            {...register("category")} 
            className={premiumInputClasses + " appearance-none"} 
          >
            <option value="Core" className="bg-[#0a1a14] text-white">Core</option>
            <option value="Language" className="bg-[#0a1a14] text-white">Language</option>
            <option value="Tool" className="bg-[#0a1a14] text-white">Tool / Tech</option>
            <option value="Other" className="bg-[#0a1a14] text-white">Other</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className={premiumLabelClasses}>Proficiency</label>
          <select 
            {...register("level")} 
            className={premiumInputClasses + " appearance-none"} 
          >
            <option value="Beginner" className="bg-[#0a1a14] text-white">Beginner</option>
            <option value="Intermediate" className="bg-[#0a1a14] text-white">Intermediate</option>
            <option value="Expert" className="bg-[#0a1a14] text-white">Expert</option>
            <option value="Master" className="bg-[#0a1a14] text-white">Master</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <GlowButton type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {defaultValues ? "Save Changes" : "Add Skill"}
        </GlowButton>
      </div>
    </form>
  )
}
