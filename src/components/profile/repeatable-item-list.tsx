"use client"

import * as React from "react"
import { Plus, Trash2, Pencil, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { GlowButton } from "@/components/ui/glow-button"

interface RepeatableItemListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  renderForm: (
    defaultValues: Partial<T> | null,
    onSuccess: () => void,
    onCancel: () => void
  ) => React.ReactNode
  onDelete: (id: string) => Promise<void>
  emptyMessage?: string
  addButtonLabel?: string
}

export function RepeatableItemList<T extends { id?: string }>({
  items,
  renderItem,
  renderForm,
  onDelete,
  emptyMessage = "No items added yet.",
  addButtonLabel = "Add Item"
}: RepeatableItemListProps<T>) {
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [isAdding, setIsAdding] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const handleEdit = (id: string) => {
    setEditingId(id)
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSuccess = () => {
    setIsAdding(false)
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {items.map((item) => {
          const isEditing = editingId === item.id

          if (isEditing) {
            return (
              <motion.div
                key={`edit-${item.id}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden bg-[#0a1a14] border border-[#34d399]/20 p-6 md:p-8 rounded-[1.5rem] relative shadow-[0_0_30px_rgba(52,211,153,0.05)]"
              >
                {renderForm(item, handleSuccess, handleCancel)}
              </motion.div>
            )
          }

          return (
            <motion.div
              key={`item-${item.id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all relative"
            >
              <div className="flex-1 w-full">{renderItem(item)}</div>
              
              <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:absolute sm:right-4 sm:top-4 sm:opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(item.id!)} className="hover:text-white h-8 w-8 bg-black/50 border border-white/10 shadow-lg backdrop-blur-md rounded-lg">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(item.id!)} 
                  disabled={deletingId === item.id}
                  className="hover:text-red-400 hover:bg-red-400/20 h-8 w-8 bg-black/50 border border-white/10 shadow-lg backdrop-blur-md rounded-lg"
                >
                  {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[#0a1a14] border border-[#34d399]/20 p-6 md:p-8 rounded-[1.5rem] relative shadow-[0_0_30px_rgba(52,211,153,0.05)]"
          >
            {renderForm(null, handleSuccess, handleCancel)}
          </motion.div>
        )}
      </AnimatePresence>

      {!isAdding && items.length === 0 && (
        <div className="text-center py-12 border border-dashed border-white/[0.08] hover:border-[#34d399]/30 rounded-[1.5rem] bg-gradient-to-b from-white/[0.01] to-transparent transition-colors group cursor-pointer" onClick={() => setIsAdding(true)}>
          <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#34d399]/10 group-hover:text-[#34d399] transition-colors">
            <Plus className="w-5 h-5 text-white/30 group-hover:text-[#34d399]" />
          </div>
          <p className="text-[13px] font-medium text-white/40 mb-2">{emptyMessage}</p>
        </div>
      )}

      {!isAdding && items.length > 0 && (
        <div className="pt-2">
          <button 
            type="button"
            onClick={() => setIsAdding(true)} 
            className="flex items-center gap-3 px-6 py-4 rounded-xl text-[12px] font-bold tracking-[0.1em] uppercase text-[#34d399]/70 hover:text-[#34d399] bg-[#34d399]/5 hover:bg-[#34d399]/10 border border-[#34d399]/10 hover:border-[#34d399]/30 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> {addButtonLabel}
          </button>
        </div>
      )}
    </div>
  )
}
