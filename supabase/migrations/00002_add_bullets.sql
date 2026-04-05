-- Add bullets array columns directly natively for cleaner JSON handling
ALTER TABLE public.experience ADD COLUMN IF NOT EXISTS bullets text[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS bullets text[] DEFAULT '{}';
