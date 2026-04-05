-- =================================================================================
-- Phase 8: Resume Export Enhancements
-- =================================================================================

-- Add export tracking columns to resumes
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS exported_at timestamptz;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'manual';
