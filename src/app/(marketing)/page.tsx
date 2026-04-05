"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import {
  ArrowRight, Layers, Brain, Target, Sparkles, FileText, Lock, Cpu, CheckCircle2, Terminal, Network
} from "lucide-react"

/* ─────────────────────── Design Tokens & Animation ─────────────────────── */

const ease = [0.16, 1, 0.3, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: 0.6 + i * 0.1, duration: 1.2, ease }
  }),
}

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } }
}

/* ─────────────────────── System HUD Component ─────────────────────── */

function SystemHUD() {
  const metrics = [
    { label: "Parsing Fidelity", value: "0.92" },
    { label: "Keyword Convergence", value: "0.87" },
    { label: "Structural Coherence", value: "0.94" },
    { label: "Readability Index", value: "0.89" }
  ]

  return (
    <motion.div 
      variants={fadeUp} initial="hidden" animate="visible" custom={4}
      className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-10 mt-10 border-t border-white/[0.05]"
    >
      {metrics.map((m, i) => (
        <div key={m.label} className="group cursor-default">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-1 rounded-full bg-[#34d399] opacity-40 group-hover:opacity-100 transition-opacity" />
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/20 font-bold group-hover:text-white/40 transition-colors">
              {m.label}
            </span>
          </div>
          <div className="text-[15px] font-mono text-white/60 tabular-nums">
            {m.value}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

/* ─────────────────────── Exploded Resume Visual ─────────────────────── */

function ExplodedResume() {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div 
      className="relative w-full max-w-[500px] aspect-[4/5]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ perspective: "2000px" }}
    >
      {/* Background Layer: Data / Code Matrix */}
      <motion.div
        animate={{ 
          rotateY: hovered ? -10 : -15, 
          rotateX: hovered ? 15 : 20,
          z: hovered ? -40 : -60,
          opacity: hovered ? 0.4 : 0.2
        }}
        transition={{ duration: 1.2, ease }}
        className="absolute inset-0 bg-[#0d1f18] rounded-3xl border border-white/5 p-8 overflow-hidden flex flex-col gap-2 shadow-2xl"
      >
        <div className="text-[8px] font-mono text-[#34d399]/40 leading-tight">
          {`{ "profile": { "name": "IDENTITY_PROTECTED", "nodes": [{ "id": "EXP_01", "weight": 0.94, "vector": [0.12, 0.88, ...] }] } }`}
        </div>
        <div className="flex-1 border-l border-white/5 ml-2 mt-4" />
      </motion.div>

      {/* Middle Layer: The Document */}
      <motion.div
        animate={{ 
          rotateY: hovered ? -5 : -8, 
          rotateX: hovered ? 8 : 12,
          z: hovered ? 0 : -20,
          y: hovered ? -10 : 0
        }}
        transition={{ duration: 1.2, ease }}
        className="absolute inset-4 bg-white rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.7)] flex flex-col p-10 overflow-hidden"
      >
        <div className="h-4 w-32 bg-gray-900 rounded-sm mb-2" />
        <div className="h-2 w-20 bg-gray-200 rounded-sm mb-6" />
        <div className="h-px w-full bg-gray-100 mb-6" />
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <div className="h-2 w-full bg-gray-100 rounded-sm" />
            <div className="h-2 w-[90%] bg-gray-100 rounded-sm" />
          </div>
          <div className="pt-4 space-y-3">
            <div className="h-3 w-40 bg-gray-800 rounded-sm" />
            <div className="h-2 w-full bg-gray-100 rounded-sm" />
            <div className="h-2 w-[85%] bg-gray-100 rounded-sm" />
          </div>
        </div>
        <div className="h-12 w-full bg-emerald-50 rounded-lg border border-emerald-100 mt-6" />
      </motion.div>

      {/* Top Layer: AI Annotations (Glass) */}
      <motion.div
        animate={{ 
          rotateY: hovered ? -2 : -4, 
          rotateX: hovered ? 4 : 6,
          z: hovered ? 60 : 40,
          x: hovered ? 20 : 10,
          y: hovered ? -20 : -10
        }}
        transition={{ duration: 1.2, ease }}
        className="absolute inset-x-12 top-24 bottom-24 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-5 h-5 text-[#34d399]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">AI Layer</span>
        </div>
        
        <div className="space-y-5">
          <div className="p-3 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] text-[#34d399] font-bold uppercase tracking-wider">Optimization</span>
              <Sparkles className="w-3 h-3 text-[#f59e0b]" />
            </div>
            <div className="h-[2px] w-full bg-[#34d399]/20 rounded-full overflow-hidden">
              <motion.div animate={{ width: "94%" }} className="h-full bg-[#34d399]" />
            </div>
          </div>
          
          <div className="absolute -right-12 top-1/2 -translate-y-1/2">
            <div className="bg-[#0d1f18] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
              <div className="text-[20px] font-light text-[#34d399]">92%</div>
              <div className="text-[8px] uppercase tracking-widest text-white/30 font-bold">ATS Confidence</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Lights */}
      <div className="absolute -inset-20 bg-[radial-gradient(circle,_rgba(52,211,153,0.1)_0%,_transparent_60%)] pointer-events-none blur-3xl z-[-1]" />
    </div>
  )
}

/* ─────────────────────── Feature Reveal Block ─────────────────────── */

function StorytellingBlock({ 
  title, description, visual, reversed = false 
}: { 
  title: React.ReactNode; description: string; visual: React.ReactNode; reversed?: boolean 
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-20%" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionReveal}
      className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-20 lg:gap-32 py-40 lg:py-60`}
    >
      <div className="w-full lg:w-[42%]">
        <h3 className="text-[3.5rem] lg:text-[4.8rem] font-light tracking-[-0.03em] leading-[0.95] text-white mb-10">
          {title}
        </h3>
        <p className="text-[19px] text-white/40 leading-[1.7] max-w-[480px]">
          {description}
        </p>
      </div>
      <div className="w-full lg:w-[58%] relative flex items-center justify-center min-h-[450px]">
        {visual}
      </div>
    </motion.div>
  )
}

/* ─────────────────────── Main Page Rebuild ─────────────────────── */

export default function FlagshipLandingPage() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 45, damping: 25 })
  
  const heroOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0])
  const heroScale = useTransform(smoothProgress, [0, 0.12], [1, 0.96])
  const heroY = useTransform(smoothProgress, [0, 0.12], [0, -50])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0a1a14] overflow-x-hidden selection:bg-[#34d399]/30 selection:text-white font-sans text-white">
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CINEMATIC ATMOSPHERE                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0a1a14]" />
        
        {/* Cinematic lighting layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,_rgba(52,211,153,0.06)_0%,_transparent_80%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_40%,_rgba(5,150,105,0.03)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_#0a1a14_100%)]" />
        
        {/* Structural Noise */}
        <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")"}} />

        {/* Cinematic Rays Effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
           <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent rotate-[30deg] blur-[2px]" />
           <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#34d399]/5 to-transparent rotate-[-30deg] blur-[3px]" />
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════ */}
      {/* NAVIGATION ARCHITECTURE                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 1.2, ease }}
        className="fixed top-0 inset-x-0 z-50 px-10 lg:px-16 py-10"
      >
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#34d399] to-[#059669] flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-[17px] font-semibold text-white tracking-[-0.02em]">
              Resume<span className="text-white/30 font-medium">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-12">
            <Link href="/auth/login" className="text-[13px] font-bold tracking-[0.1em] text-white/40 hover:text-white transition-colors uppercase">
              System Access
            </Link>
            <Link href="/app">
              <button className="bg-white text-[#0a1a14] px-7 py-3 rounded-xl text-[12px] font-black tracking-[0.05em] uppercase hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-2">
                Launch Base <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </motion.nav>


      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HERO SYSTEM                                                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-[100svh] flex flex-col justify-center px-10 lg:px-16 pt-32 pb-20"
      >
        <div className="w-full max-w-[1500px] mx-auto flex flex-col lg:flex-row items-center gap-20 lg:gap-12 z-10">
          
          <div className="w-full lg:w-[48%] flex flex-col items-start">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="px-3 py-1.5 rounded-full border border-[#34d399]/20 bg-[#34d399]/5 flex items-center gap-3 mb-12"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] shadow-[0_0_10px_#34d399] animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#34d399] uppercase">Core Engine Online</span>
            </motion.div>

            <motion.h1 
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="text-[4.5rem] sm:text-[6rem] lg:text-[8.5rem] font-extralight tracking-[-0.05em] leading-[0.88] text-white mb-12"
            >
              The AI Career <br />
              <span className="font-medium bg-gradient-to-r from-white via-[#34d399] to-[#059669] bg-clip-text text-transparent">
                Operating System.
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="text-[20px] text-white/40 font-light leading-[1.7] max-w-[520px] mb-16 tracking-[0.01em]"
            >
              Deterministic layout extraction meets real-time ATS heuristic mapping. Engineered for zero margin of error. 
            </motion.p>

            <motion.div 
              variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-col sm:flex-row items-stretch gap-6 w-full lg:w-auto"
            >
              <Link href="/auth/login">
                <button className="bg-white text-[#0a1a14] rounded-2xl px-12 py-6 font-black tracking-[0.05em] uppercase text-[14px] shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex items-center justify-center gap-4">
                  Initialize Build
                  <Network className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
              <Link href="/app">
                <button className="bg-white/5 border border-white/10 text-white/40 rounded-2xl px-12 py-6 font-bold tracking-[0.05em] uppercase text-[14px] hover:bg-white/10 hover:text-white transition-all duration-300">
                  Documentation
                </button>
              </Link>
            </motion.div>

            <SystemHUD />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 1, duration: 2, ease }}
            className="w-full lg:w-[52%] relative flex items-center justify-center lg:-mr-16"
          >
            <ExplodedResume />
          </motion.div>
        </div>
      </motion.section>


      {/* ═══════════════════════════════════════════════════════════ */}
      {/* REVEAL SYSTEMS                                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[1500px] mx-auto px-10 lg:px-16">
        
        <div className="h-px bg-white/[0.03] w-full" />

        <StorytellingBlock
          title={<>Syntactic <br/><span className="text-[#34d399]">extraction.</span></>}
          description="Traditional builders rely on static templates. ResumeAI uses a geometric solver to analyze your professional metadata and dynamically compute optimal typography hierarchy and component density — essentially 'compiling' your resume into existence."
          visual={
            <div className="relative w-full max-w-[550px] aspect-video">
               <div className="absolute inset-0 bg-[#0d1f18] rounded-3xl border border-white/[0.05] shadow-2xl overflow-hidden">
                 <div className="absolute top-0 inset-x-0 h-10 border-b border-white/[0.03] flex items-center px-4 gap-2">
                   <div className="w-2 h-2 rounded-full bg-white/10" />
                   <div className="w-2 h-2 rounded-full bg-white/10" />
                   <div className="w-2 h-2 rounded-full bg-white/10" />
                   <span className="text-[9px] font-mono text-white/20 ml-2 tracking-widest uppercase">Layout_Engine.solver</span>
                 </div>
                 <div className="p-8 pt-16 flex flex-col gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-6 bg-[#34d399]/10 border border-[#34d399]/20 rounded" />
                      <div className="flex-1 h-px bg-[#34d399]/10" />
                      <span className="text-[10px] font-mono text-[#34d399]">0.9431px</span>
                    </div>
                    {[1,2,3].map(i => (
                      <div key={i} className="flex gap-4">
                         <div className="w-full h-8 bg-white/[0.02] border border-white/5 rounded" />
                      </div>
                    ))}
                    <div className="absolute bottom-8 right-8 w-40 h-40 border border-[#34d399]/5 rounded-full flex items-center justify-center">
                       <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-[1px] h-full bg-[#34d399]/10" />
                       <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-dashed border-[#34d399]/10 rounded-full" />
                    </div>
                 </div>
               </div>
            </div>
          }
        />

        <StorytellingBlock
          reversed
          title={<>Vector <br/><span className="text-[#f59e0b]">targeting.</span></>}
          description="High-fidelity semantic mapping. We deconstruct job descriptions into recursive requirement nodes, then re-weight your career profile to maximize alignment with the target destination's ATS topography."
          visual={
            <div className="relative w-full h-[400px]">
               <div className="absolute top-0 left-0 w-64 p-6 bg-[#0d1f18] border border-white/10 rounded-2xl shadow-2xl z-20">
                 <div className="text-[10px] text-white/40 font-bold mb-4 uppercase tracking-widest">Input Node</div>
                 <div className="h-2 w-full bg-white/5 rounded mb-2" />
                 <div className="h-2 w-[80%] bg-white/5 rounded" />
               </div>
               
               <div className="absolute bottom-0 right-0 w-64 p-6 bg-[#0d1f18] border border-[#34d399]/20 rounded-2xl shadow-2xl z-20">
                 <div className="text-[10px] text-[#34d399] font-bold mb-4 uppercase tracking-widest">Canonical Output</div>
                 <div className="h-2 w-full bg-[#34d399]/10 rounded mb-2" />
                 <div className="h-2 w-[90%] bg-[#34d399]/10 rounded" />
               </div>

               <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                 <motion.path 
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2 }}
                    d="M 250 100 C 500 100, 300 300, 500 300" 
                    fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="5,5" 
                 />
                 <motion.circle 
                    animate={{ cx: [250, 500], cy: [100, 300] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    r="4" fill="#34d399" 
                 />
               </svg>
            </div>
          }
        />

        <StorytellingBlock
          title={<>ATS <br/><span className="text-[#22d3ee]">regression.</span></>}
          description="Every artifact generated is tested against a comprehensive matrix of enterprise applicant tracking systems. We simulate parsing passes across 14 major vendors to ensure your structure is impenetrable and highly readable by machines."
          visual={
             <div className="relative w-full max-w-[440px] bg-[#0d1f18] rounded-3xl border border-white/5 p-10 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                   <div className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">Execution Report</div>
                   <div className="px-3 py-1 rounded bg-[#34d399]/10 border border-[#34d399]/20 text-[10px] text-[#34d399] font-bold tracking-widest">READY</div>
                </div>
                <div className="space-y-6">
                   {['Workday', 'Lever', 'Greenhouse', 'iCIMS'].map(vendor => (
                     <div key={vendor} className="flex items-center gap-6">
                        <span className="text-[13px] font-medium text-white/50 w-24">{vendor}</span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} whileInView={{ width: '96%' }} transition={{ duration: 1.5 }} className="h-full bg-[#34d399]" />
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                     </div>
                   ))}
                </div>
             </div>
          }
        />
      </div>


      {/* ═══════════════════════════════════════════════════════════ */}
      {/* FINAL ACTIVATION MOMENT                                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-60 lg:py-80 px-10 overflow-hidden">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionReveal}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-[5rem] lg:text-[10rem] font-extralight tracking-[-0.06em] leading-[0.85] text-white mb-16">
            Ready to <br /> <span className="font-medium">Initialize.</span>
          </h2>
          <p className="text-[22px] text-white/30 font-light max-w-2xl mx-auto mb-20 leading-relaxed">
            Exit the archaic cycle. Ensure your professional profile is processed with absolute fidelity.
          </p>
          
          <Link href="/auth/login" className="inline-block relative group">
            <div className="absolute -inset-4 bg-[#34d399]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <button className="relative bg-white text-[#0a1a14] rounded-2xl px-16 py-8 font-black tracking-[0.05em] uppercase text-[15px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-all duration-500">
              Access Terminal
            </button>
          </Link>
          
          <div className="mt-12 flex items-center justify-center gap-6 opacity-20 grayscale">
            <Terminal className="w-5 h-5 text-white" />
            <Cpu className="w-5 h-5 text-white" />
            <Target className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      </section>


      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ENTERPRISE FOOTER                                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 px-16 py-16 border-t border-white/[0.04] bg-[#0a1a14]">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white/20" />
             </div>
             <span className="text-[14px] font-bold text-white/20 tracking-widest uppercase">ResumeAI Kernel v4.2</span>
          </div>
          
          <div className="flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.2em] text-white/15">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                <span className="text-[#34d399]/40">Primary Node Active</span>
             </div>
             <span>Operational Log</span>
             <span>Decentralized Identity</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
