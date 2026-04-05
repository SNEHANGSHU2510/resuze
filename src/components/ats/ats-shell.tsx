"use client"

import * as React from "react"
import { NormalizedResumeData } from "@/types/normalized-resume"
import { ATSReport } from "@/types/ats-report"
import { ParsedJobDescription } from "@/types/job-description"
import { parseJobDescription } from "@/lib/jd/parse-job-description"
import { buildATSReport } from "@/lib/ats/build-ats-report"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/toast-provider"
import { motion, AnimatePresence } from "framer-motion"

import { ATSControls } from "./ats-controls"
import { ATSScoreRing } from "./ats-score-ring"
import { ATSScoreBreakdown } from "./ats-score-breakdown"
import { KeywordAnalysisPanel } from "./keyword-analysis-panel"
import { StrengthsPanel } from "./strengths-panel"
import { WeaknessesPanel } from "./weaknesses-panel"
import { RecommendationsPanel } from "./recommendations-panel"
import { TemplateCompatibilityCard } from "./template-compatibility-card"
import { ATSInsightSummary } from "./ats-insight-summary"

interface SavedResume {
  id: string
  title: string
  resume_json: any
  created_at: string
}

interface SavedJD {
  id: string
  job_title: string
  company: string | null
  content: string
  parsed_requirements: any
}

interface ATSShellProps {
  savedResumes: SavedResume[]
  savedJDs: SavedJD[]
}

export function ATSShell({ savedResumes, savedJDs }: ATSShellProps) {
  const [selectedResumeId, setSelectedResumeId] = React.useState<string | null>(null)
  const [selectedJDId, setSelectedJDId] = React.useState<string | null>(null)
  const [jdPasteText, setJdPasteText] = React.useState("")
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [report, setReport] = React.useState<ATSReport | null>(null)

  const supabase = createClient()
  const { toast } = useToast()

  const handleRunAnalysis = async () => {
    if (!selectedResumeId) return

    try {
      setIsAnalyzing(true)

      // 1. Get the selected resume's data
      const selectedResume = savedResumes.find((r) => r.id === selectedResumeId)
      if (!selectedResume) throw new Error("Resume not found")

      const resumeJson = selectedResume.resume_json
      const resumeData: NormalizedResumeData = resumeJson.data
      const templateSlug: string = resumeJson.template_slug || "ats-classic"

      // 2. Get or build the parsed JD
      let parsedJD: ParsedJobDescription
      let jdId: string | undefined

      if (selectedJDId) {
        // Use saved JD
        const savedJD = savedJDs.find((j) => j.id === selectedJDId)
        if (!savedJD) throw new Error("JD not found")

        if (savedJD.parsed_requirements && typeof savedJD.parsed_requirements === "object" && savedJD.parsed_requirements.raw_text) {
          parsedJD = savedJD.parsed_requirements as ParsedJobDescription
        } else {
          parsedJD = parseJobDescription({
            raw_text: savedJD.content,
            role_title: savedJD.job_title || "",
            company: savedJD.company || "",
          })
        }
        jdId = savedJD.id
      } else if (jdPasteText.trim().length > 50) {
        // Parse fresh JD
        parsedJD = parseJobDescription({
          raw_text: jdPasteText,
          role_title: "",
          company: "",
        })

        // Save it
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
          const { data: jdRecord } = await supabase.from("job_descriptions").insert({
            user_id: userData.user.id,
            job_title: "ATS Analysis JD",
            content: jdPasteText,
            parsed_requirements: parsedJD,
          }).select().single()
          if (jdRecord) jdId = jdRecord.id
        }
      } else {
        throw new Error("No JD provided")
      }

      // Brief processing delay for perceived intelligence
      await new Promise((r) => setTimeout(r, 600))

      // 3. Build the ATS report
      const atsReport = buildATSReport(resumeData, parsedJD, templateSlug, selectedResumeId, jdId)

      // 4. Save to database
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        await supabase.from("ats_reports").insert({
          user_id: userData.user.id,
          resume_id: selectedResumeId,
          job_description_id: jdId || null,
          overall_score: atsReport.scores.overall_score,
          keyword_score: atsReport.scores.keyword_score,
          format_score: atsReport.scores.format_score,
          section_score: atsReport.scores.section_score,
          semantic_score: atsReport.scores.semantic_score,
          strengths_json: atsReport.strengths,
          weaknesses_json: atsReport.weaknesses,
          recommendations_json: atsReport.recommendations,
          chart_data_json: atsReport.chart_data,
        })
      }

      setReport(atsReport)
      toast("success", `ATS analysis complete — Overall score: ${atsReport.scores.overall_score}%`)
    } catch (err) {
      console.error("ATS analysis failed:", err)
      toast("error", "ATS analysis failed. Please check your inputs and try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen pb-20 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Controls */}
        <div className="lg:col-span-3">
          <ATSControls
            savedResumes={savedResumes}
            savedJDs={savedJDs}
            selectedResumeId={selectedResumeId}
            selectedJDId={selectedJDId}
            jdPasteText={jdPasteText}
            onSelectResume={setSelectedResumeId}
            onSelectJD={setSelectedJDId}
            onPasteJD={setJdPasteText}
            onRunAnalysis={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
            hasReport={!!report}
          />
        </div>

        {/* Right: Report Dashboard */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {!report && !isAnalyzing && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[60vh]"
              >
                <div className="text-center space-y-4 px-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/10 border border-[var(--neon-blue)]/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(52,211,153,0.15)]">
                    <span className="text-4xl">📊</span>
                  </div>
                  <h3 className="text-2xl text-white font-bold tracking-tight">ATS Intelligence Center</h3>
                  <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
                    Select a saved resume, provide a target job description, and run the analysis to see a detailed ATS compatibility report.
                  </p>
                </div>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[60vh]"
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto relative">
                    <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--neon-blue)] border-l-[var(--neon-cyan)] animate-spin" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--neon-purple)] animate-spin direction-reverse" style={{ animationDuration: '1.5s' }} />
                  </div>
                  <h3 className="text-xl text-white font-bold tracking-tight">Analyzing Resume...</h3>
                  <p className="text-sm text-white/40">Scoring keywords, sections, formatting, content quality, and role relevance.</p>
                </div>
              </motion.div>
            )}

            {report && !isAnalyzing && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Row 1: Score Ring + Insight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ATSScoreRing score={report.scores.overall_score} />
                  <div className="md:col-span-2 space-y-6">
                    <ATSInsightSummary summary={report.insight_summary} />
                    <TemplateCompatibilityCard
                      label={report.template_compatibility.label}
                      score={report.template_compatibility.score}
                      note={report.template_compatibility.note}
                    />
                  </div>
                </div>

                {/* Row 2: Score Breakdown Chart */}
                <ATSScoreBreakdown chartData={report.chart_data} />

                {/* Row 3: Keywords */}
                <KeywordAnalysisPanel keywords={report.keywords} />

                {/* Row 4: Strengths + Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StrengthsPanel strengths={report.strengths} />
                  <WeaknessesPanel weaknesses={report.weaknesses} />
                </div>

                {/* Row 5: Recommendations */}
                <RecommendationsPanel recommendations={report.recommendations} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
