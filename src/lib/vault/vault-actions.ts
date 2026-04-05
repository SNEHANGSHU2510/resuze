import { SupabaseClient } from "@supabase/supabase-js"

/**
 * Deletes a resume version and its associated PDF from storage.
 */
export async function deleteResumeVersion(
  supabase: SupabaseClient,
  resumeId: string,
  pdfPath: string | null
): Promise<void> {
  // Delete PDF from storage if exists
  if (pdfPath) {
    await supabase.storage.from("resume_pdfs").remove([pdfPath])
  }

  // Delete the resume record
  const { error } = await supabase.from("resumes").delete().eq("id", resumeId)
  if (error) throw error
}

/**
 * Duplicates a resume version as a new row.
 */
export async function duplicateResumeVersion(
  supabase: SupabaseClient,
  userId: string,
  resumeId: string
): Promise<string | null> {
  // Fetch the original
  const { data: original, error: fetchError } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", resumeId)
    .single()

  if (fetchError || !original) throw fetchError || new Error("Resume not found")

  // Insert a duplicate
  const { data: duplicate, error: insertError } = await supabase
    .from("resumes")
    .insert({
      user_id: userId,
      title: `${original.title} (Copy)`,
      resume_json: original.resume_json,
      source_type: original.source_type || "manual",
    })
    .select()
    .single()

  if (insertError) throw insertError
  return duplicate?.id || null
}
