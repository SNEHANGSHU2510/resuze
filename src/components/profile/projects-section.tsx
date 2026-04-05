"use client"

import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema, type ProjectValues } from "@/lib/validations/profile"
import { SectionCard } from "./section-card"
import { RepeatableItemList } from "./repeatable-item-list"
import { GlowButton } from "@/components/ui/glow-button"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { FolderGit2, Loader2, Link as LinkIcon, Laptop } from "lucide-react"
import { useRouter } from "next/navigation"
import { BulletListEditor } from "./bullet-list-editor"
import { premiumInputClasses, premiumLabelClasses } from "./shared-styles"

export function ProjectsSection({ initialItems }: { initialItems: ProjectValues[] }) {
  const [items, setItems] = React.useState<ProjectValues[]>(initialItems)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) throw error
    setItems((prev) => prev.filter((item) => item.id !== id))
    router.refresh()
  }

  const handleSave = async (data: ProjectValues, onSuccess: () => void) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error("Not authenticated")

      const payload = {
        user_id: userData.user.id,
        name: data.name,
        role: data.role || null,
        url: data.url || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        description: data.description || null,
        bullets: (data.bullets || []).filter((b) => b.trim() !== ""),
      }

      if (data.id) {
        const { data: updatedData, error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", data.id)
          .select()
          .single()

        if (error) throw error
        setItems((prev) => prev.map((item) => (item.id === updatedData.id ? updatedData : item)))
      } else {
        const { data: insertedData, error } = await supabase
          .from("projects")
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
    <SectionCard title="Projects" description="Showcase technical projects, case studies, or freelance work.">
      <RepeatableItemList<ProjectValues>
        items={items}
        onDelete={handleDelete}
        emptyMessage="No projects added. Document your significant work here."
        addButtonLabel="Add Project"
        renderItem={(item) => (
          <div className="flex items-start gap-5 p-5 bg-[#0a1a14] border border-white/[0.05] rounded-[1.5rem] group hover:border-[#10b981]/20 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 shrink-0 relative z-10">
              <Laptop className="h-5 w-5 text-[#10b981]/50 group-hover:text-[#10b981] transition-colors" />
            </div>
            <div className="flex-1 relative z-10 pt-1">
              <div className="flex items-center gap-3">
                <h4 className="text-[17px] font-medium text-white tracking-tight">{item.name}</h4>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#10b981]/50 hover:text-[#10b981] transition-colors border border-[#10b981]/20 p-1.5 rounded-md hover:bg-[#10b981]/10">
                    <LinkIcon className="h-3 w-3" />
                  </a>
                )}
              </div>
              <p className="text-[13px] font-normal text-white/50 mt-1 mb-4">{item.role}</p>
              {item.bullets && item.bullets.length > 0 && (
                <ul className="space-y-2">
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-[13px] text-white/60 flex items-start leading-relaxed font-medium">
                      <span className="text-[#10b981] opacity-40 mr-3 mt-1.5 w-1 h-1 rounded-full shrink-0 shadow-[0_0_5px_#10b981]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        renderForm={(defaultValues, onSuccess, onCancel) => {
           return <ProjectForm defaultValues={defaultValues} onSubmit={(data) => handleSave(data, onSuccess)} onCancel={onCancel} />
        }}
      />
    </SectionCard>
  )
}

function ProjectForm({ defaultValues, onSubmit, onCancel }: { 
  defaultValues: Partial<ProjectValues> | null, 
  onSubmit: (data: ProjectValues) => Promise<void>, 
  onCancel: () => void 
}) {
  const methods = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues || {
      name: "",
      role: "",
      url: "",
      start_date: "",
      end_date: "",
      description: "",
      bullets: [""],
    }
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = methods

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div className="space-y-1">
            <label className={premiumLabelClasses}>Project Name</label>
            <input 
              {...register("name")} 
              className={premiumInputClasses} 
              placeholder="e.g. Distributed Core"
            />
            {errors.name && <span className="text-[11px] font-bold tracking-widest uppercase text-red-500/80 mt-2 block">{errors.name.message}</span>}
          </div>
          
          <div className="space-y-1">
            <label className={premiumLabelClasses}>Your Role / System Focus</label>
            <input 
              {...register("role")} 
              className={premiumInputClasses} 
              placeholder="e.g. Lead Engineer"
            />
          </div>

          <div className="space-y-1 col-span-1 md:col-span-2">
            <label className={premiumLabelClasses}>External URL / Repository</label>
            <input 
              type="url"
              {...register("url")} 
              className={premiumInputClasses} 
              placeholder="https://github.com/..."
            />
            {errors.url && <span className="text-[11px] font-bold tracking-widest uppercase text-red-500/80 mt-2 block">{errors.url.message}</span>}
          </div>
        </div>

        <div className="space-y-2 mt-4 pt-4 border-t border-white/[0.05]">
           <label className={premiumLabelClasses}>Key Features & Engineering Metrics</label>
           <p className="text-[12px] font-medium text-white/30 mb-4 tracking-wide">Document technical challenges, features shipped, and impact metrics.</p>
           <BulletListEditor name="bullets" placeholder="Describe a technical challenge, feature shipped, or metric improved." />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
          <GlowButton type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {defaultValues ? "Save Changes" : "Add Project"}
          </GlowButton>
        </div>
      </form>
    </FormProvider>
  )
}
