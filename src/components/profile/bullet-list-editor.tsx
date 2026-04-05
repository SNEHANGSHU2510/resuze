"use client"

import * as React from "react"
import { useFormContext } from "react-hook-form"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BulletListEditorProps {
  name: string
  placeholder?: string
}

export function BulletListEditor({ name, placeholder = "Add a highlight or achievement..." }: BulletListEditorProps) {
  const { setValue, watch } = useFormContext()
  const bullets: string[] = watch(name) || [""]

  const addBullet = () => {
    setValue(name, [...bullets, ""], { shouldDirty: true })
  }

  const removeBullet = (index: number) => {
    const updated = bullets.filter((_, i) => i !== index)
    setValue(name, updated.length === 0 ? [""] : updated, { shouldDirty: true })
  }

  const updateBullet = (index: number, value: string) => {
    const updated = [...bullets]
    updated[index] = value
    setValue(name, updated, { shouldDirty: true })
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {bullets.map((bullet, index) => (
          <div key={index} className="flex items-start gap-2 group">
            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_theme('colors.primary.DEFAULT')] shrink-0" />
            <div className="flex-1 relative">
              <textarea
                value={bullet}
                onChange={(e) => updateBullet(index, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all min-h-[40px] resize-y"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeBullet(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-9 w-9 shrink-0"
              aria-label="Remove bullet"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addBullet}
        className="text-primary hover:text-white hover:bg-primary/20 transition-colors text-xs py-1 h-7"
      >
        <Plus className="w-3 h-3 mr-1" /> Add Bullet Point
      </Button>
    </div>
  )
}
