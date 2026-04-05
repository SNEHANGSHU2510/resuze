import { SupabaseClient } from "@supabase/supabase-js"

/**
 * Uploads a PDF blob to the private Supabase storage bucket.
 * Path convention: {user_id}/{resume_id}/{sanitized_title}.pdf
 *
 * Returns the storage path on success.
 */
export async function uploadResumePDF(
  supabase: SupabaseClient,
  userId: string,
  resumeId: string,
  title: string,
  pdfBlob: Blob
): Promise<string> {
  const sanitizedTitle = title
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 60)
  
  const filePath = `${userId}/${resumeId}/${sanitizedTitle}.pdf`

  const { error } = await supabase.storage
    .from("resume_pdfs")
    .upload(filePath, pdfBlob, {
      contentType: "application/pdf",
      upsert: true, // Overwrite if re-exporting
    })

  if (error) throw error

  return filePath
}

/**
 * Updates the resumes table with the PDF path and export timestamp.
 */
export async function updateResumeWithPDFPath(
  supabase: SupabaseClient,
  resumeId: string,
  pdfPath: string
): Promise<void> {
  const { error } = await supabase
    .from("resumes")
    .update({
      pdf_path: pdfPath,
      exported_at: new Date().toISOString(),
    })
    .eq("id", resumeId)

  if (error) throw error
}
