-- =================================================================================
-- INITIAL AI RESUME PLATFORM SCHEMA (Phase 2B)
-- =================================================================================

-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name text,
  last_name text,
  headline text,
  email text,
  phone text,
  website text,
  linkedin_url text,
  github_url text,
  location text,
  summary text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Education
CREATE TABLE IF NOT EXISTS public.education (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  institution text NOT NULL,
  degree text NOT NULL,
  field_of_study text,
  start_date date,
  end_date date,
  current boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Experience
CREATE TABLE IF NOT EXISTS public.experience (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company text NOT NULL,
  title text NOT NULL,
  location text,
  start_date date,
  end_date date,
  current boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  role text,
  start_date date,
  end_date date,
  url text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Skills
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text,
  level text,
  created_at timestamptz DEFAULT now()
);

-- 6. Resume Templates (Centrally managed)
CREATE TABLE IF NOT EXISTS public.resume_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text,
  preview_image_url text,
  html_structure text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. Resumes
CREATE TABLE IF NOT EXISTS public.resumes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  template_id uuid REFERENCES public.resume_templates(id) ON DELETE SET NULL,
  resume_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  rendered_html text,
  pdf_path text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. Job Descriptions
CREATE TABLE IF NOT EXISTS public.job_descriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_title text NOT NULL,
  company text,
  content text NOT NULL,
  parsed_requirements jsonb,
  url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. ATS Reports
CREATE TABLE IF NOT EXISTS public.ats_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resume_id uuid REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  job_description_id uuid REFERENCES public.job_descriptions(id) ON DELETE SET NULL,
  overall_score integer NOT NULL DEFAULT 0,
  keyword_score integer NOT NULL DEFAULT 0,
  format_score integer NOT NULL DEFAULT 0,
  section_score integer NOT NULL DEFAULT 0,
  semantic_score integer NOT NULL DEFAULT 0,
  strengths_json jsonb,
  weaknesses_json jsonb,
  recommendations_json jsonb,
  chart_data_json jsonb,
  created_at timestamptz DEFAULT now()
);

-- =================================================================================
-- ROW LEVEL SECURITY (RLS)
-- =================================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only select and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- Note: Insert is handled by trigger on auth.users

-- Education
CREATE POLICY "Users map own education" ON public.education FOR ALL USING (auth.uid() = user_id);

-- Experience
CREATE POLICY "Users map own experience" ON public.experience FOR ALL USING (auth.uid() = user_id);

-- Projects
CREATE POLICY "Users map own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);

-- Skills
CREATE POLICY "Users map own skills" ON public.skills FOR ALL USING (auth.uid() = user_id);

-- Resumes
CREATE POLICY "Users map own resumes" ON public.resumes FOR ALL USING (auth.uid() = user_id);

-- Job Descriptions
CREATE POLICY "Users map own job descriptions" ON public.job_descriptions FOR ALL USING (auth.uid() = user_id);

-- ATS Reports
CREATE POLICY "Users map own ATS reports" ON public.ats_reports FOR ALL USING (auth.uid() = user_id);

-- Resume Templates: Readable by all authenticated users
CREATE POLICY "Templates are readable by authenticated users" ON public.resume_templates FOR SELECT TO authenticated USING (true);

-- =================================================================================
-- TRIGGERS
-- =================================================================================

-- Handle new user signup: link auth.users -> public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE TRIGGER set_education_updated_at BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE TRIGGER set_experience_updated_at BEFORE UPDATE ON public.experience FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE TRIGGER set_resume_templates_updated_at BEFORE UPDATE ON public.resume_templates FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE TRIGGER set_resumes_updated_at BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
CREATE TRIGGER set_job_descriptions_updated_at BEFORE UPDATE ON public.job_descriptions FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();

-- =================================================================================
-- STORAGE: Private Bucket for Resume PDFs
-- =================================================================================

-- Create the private bucket 'resume_pdfs'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resume_pdfs', 'resume_pdfs', false) 
ON CONFLICT (id) DO NOTHING;

-- Storage Policies: Path structure should be `[user_id]/[file_name]`
CREATE POLICY "Users can upload own PDFs" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'resume_pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own PDFs" 
ON storage.objects FOR SELECT TO authenticated 
USING (bucket_id = 'resume_pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own PDFs" 
ON storage.objects FOR UPDATE TO authenticated 
USING (bucket_id = 'resume_pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own PDFs" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'resume_pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);
