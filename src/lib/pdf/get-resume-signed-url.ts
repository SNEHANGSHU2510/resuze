import { SupabaseClient } from "@supabase/supabase-js"

/**
 * Generates a time-limited signed URL for a private resume PDF.
 * Default expiry: 5 minutes (300 seconds).
 */
export async function getResumeSignedUrl(
  supabase: SupabaseClient,
  pdfPath: string,
  expiresIn: number = 300
): Promise<string> {
  const { data, error } = await supabase.storage
    .from("resume_pdfs")
    .createSignedUrl(pdfPath, expiresIn)

  if (error) throw error
  if (!data?.signedUrl) throw new Error("Failed to generate signed URL")

  return data.signedUrl
}
