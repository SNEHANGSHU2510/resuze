"use client"

import { ParticleField } from "@/components/ui/particle-field"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Loader2, ChevronRight, Activity } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  // Track mouse for parallax and interactivity
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, rawX: 0 })
  const supabase = createClient()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setMousePos({ x, y, rawX: e.clientX })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError("")
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (authError) throw authError
    } catch {
      setError("Neural handshake rejected. Access denied.")
      setLoading(false)
    }
  }

  // Derived interactive states
  const parallaxCoreX = mousePos.x * 25
  const parallaxCoreY = mousePos.y * 25
  const isHoveringPanel = mousePos.x > 0.1
  const coreGlowMultiplier = isHoveringPanel ? 1.3 : 1
  const connectionOpacity = isHoveringPanel ? 0.6 : 0

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#0a1a14] selection:bg-[var(--neon-cyan)]/30 selection:text-[var(--neon-cyan)] perspective-1000">
      
      {/* ========================================================= */}
      {/* LAYER 1: Deep Background Gradients & Dynamic Waves          */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_rgba(52,211,153,0.15)_0%,_#0a1a14_100%)] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,_rgba(139,92,246,0.1)_0%,_transparent_60%)] opacity-70" />
        {/* Slow moving fog/wave overlay */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.04] mix-blend-overlay" />
        <div className="absolute top-0 left-0 w-[200%] h-[200%] bg-gradient-to-br from-transparent via-[var(--neon-blue)]/5 to-transparent blur-[120px] animate-[slide-diagonal_20s_infinite_alternate_ease-in-out]" />
      </div>

      {/* ========================================================= */}
      {/* LAYER 2: Digital Grid & Particles                         */}
      {/* ========================================================= */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute inset-0 z-[5] pointer-events-none"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)] mix-blend-screen" />
        {/* Multi-sized particles */}
        <ParticleField count={150} className="opacity-70 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </motion.div>

      {/* ========================================================= */}
      {/* LAYER 3: Glowing Light Streaks                            */}
      {/* ========================================================= */}
      <motion.div 
        className="absolute inset-0 z-[10] pointer-events-none"
        animate={{ x: parallaxCoreX * 1.5, y: parallaxCoreY * 1.5 }}
        transition={{ type: "tween", ease: "easeOut", duration: 1.5 }}
      >
        <div className="absolute top-[10%] left-[20%] w-[1200px] h-[30px] bg-[var(--neon-cyan)]/10 blur-[80px] -rotate-45" />
        <div className="absolute bottom-[20%] left-[40%] w-[800px] h-[40px] bg-[var(--neon-purple)]/10 blur-[90px] -rotate-[30deg]" />
      </motion.div>

      {/* ========================================================= */}
      {/* ENERGY CONNECTION RAY (Interaction Element)                 */}
      {/* ========================================================= */}
      <div 
        className="absolute top-1/2 left-[30%] right-[20%] h-px -translate-y-1/2 z-[15] pointer-events-none transition-all duration-1000 ease-out"
        style={{ 
          opacity: connectionOpacity,
          background: "linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.5), rgba(139, 92, 246, 0.4), transparent)",
          boxShadow: "0 0 20px rgba(52, 211, 153, 0.4)",
          transform: `translateY(${mousePos.y * -10}px)`
        }}
      />

      {/* ========================================================= */}
      {/* LAYOUT STRUCTURE                                          */}
      {/* ========================================================= */}
      <div className="relative z-[20] w-full flex flex-col lg:flex-row min-h-screen">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: The AI Core (Layer 4)                        */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[55%] relative flex items-center justify-center min-h-[50vh] lg:min-h-screen">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, x: parallaxCoreX, y: parallaxCoreY }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeOut" }, 
              scale: { duration: 1.5, ease: "easeOut" },
              x: { type: "tween", ease: "easeOut", duration: 1 },
              y: { type: "tween", ease: "easeOut", duration: 1 }
            }}
            className="relative flex items-center justify-center w-[600px] h-[600px]"
          >
            {/* Reactive Ambient Core Glow */}
            <motion.div 
              animate={{ scale: coreGlowMultiplier * 1.05, opacity: isHoveringPanel ? 0.3 : 0.15 }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 rounded-full bg-[var(--neon-cyan)] blur-[120px]" 
            />
            <motion.div 
              animate={{ scale: coreGlowMultiplier * 1.3, opacity: isHoveringPanel ? 0.3 : 0.15 }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
              className="absolute inset-0 rounded-full bg-[var(--neon-purple)] blur-[150px] mix-blend-screen" 
            />
            
            {/* Soft Animated Light Waves (Inner Cone Rays) */}
            <div className="absolute w-[800px] h-[800px] rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(52,211,153,0.1)_45deg,transparent_90deg,rgba(139,92,246,0.1)_180deg,transparent_270deg,rgba(52,211,153,0.1)_315deg,transparent_360deg)] animate-[spin_20s_linear_infinite] mix-blend-screen opacity-50" />
            
            {/* The Central Neural Sphere with Grid Mesh */}
            <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-[#0a1a14] via-[#05112e] to-[var(--neon-cyan)] shadow-[0_0_120px_rgba(52,211,153,0.4),inset_0_0_80px_rgba(255,255,255,0.3)] overflow-hidden animate-[breathing_4s_ease-in-out_infinite]">
              {/* Internal Neural Grid Texture */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(52,211,153,0.3)_1px,transparent_1px)] bg-[size:8px_8px] opacity-40 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_10%,transparent_80%)] animate-[spin_60s_linear_infinite_reverse]" />
              {/* Internal Plasma Waves */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--neon-purple)]/40 to-transparent blur-xl animate-[plasma-wave_5s_ease-in-out_infinite_alternate]" />
            </div>

            {/* Glowing Core Edge (Breathing Effect) */}
            <div className="absolute w-[260px] h-[260px] rounded-full border border-[var(--neon-cyan)]/30 animate-[breathing-glow_4s_ease-in-out_infinite]" />

            {/* Intelligent Orbit Rings System */}
            
            {/* Inner Ring (Fastest) */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 60, rotateY: 12, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="absolute w-[450px] h-[450px] rounded-full transform-gpu perspective-1000 rotate-x-60 rotate-y-12"
            >
              {/* Ring Track */}
              <div className="absolute inset-0 rounded-full border-[0.5px] border-[var(--neon-cyan)]/20" />
              {/* Rotating Node with Light Trail pseudo-effect (conic gradient) */}
              <div className="absolute inset-0 rounded-full animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(52,211,153,0.4)_360deg)] [mask-image:radial-gradient(transparent_49%,black_50%,black_51%,transparent_52%)]" />
              <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_15px_rgba(52,211,153,1),0_0_30px_rgba(52,211,153,0.5)]">
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-60" />
                </div>
              </div>
            </motion.div>

            {/* Middle Ring (Medium, Reverse) */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 75, rotateY: 6, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.4 }}
              className="absolute w-[700px] h-[700px] rounded-full transform-gpu perspective-1000 rotate-x-75 rotate-y-6"
            >
              {/* Dashed Track */}
              <div className="absolute inset-0 rounded-full border border-[var(--neon-blue)]/10 border-dashed" />
              <div className="absolute inset-0 animate-[spin_25s_linear_infinite_reverse]">
                <div className="absolute bottom-1/4 right-0 w-3 h-3 rounded-full bg-[var(--neon-blue)] shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
                <div className="absolute top-1/4 left-0 w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
            </motion.div>

            {/* Outer Ring (Slowest) */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 60, rotateY: -20, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
              className="absolute w-[900px] h-[900px] rounded-full transform-gpu perspective-1000 rotate-x-60 -rotate-y-20"
            >
              <div className="absolute inset-0 rounded-full border-[0.5px] border-[var(--neon-purple)]/20" />
              {/* Light Trail */}
              <div className="absolute inset-0 rounded-full animate-[spin_40s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(139,92,246,0.3)_360deg)] [mask-image:radial-gradient(transparent_49.5%,black_50%,black_50.5%,transparent_51%)]" />
              <div className="absolute inset-0 animate-[spin_40s_linear_infinite]">
                 <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--neon-purple)] shadow-[0_0_25px_rgba(139,92,246,1),0_0_50px_rgba(139,92,246,0.4)]">
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30" />
                 </div>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: The Auth UI (Layer 5)                       */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-16 xl:p-24 relative z-[20]">
          
          <motion.div
            initial={{ opacity: 0, x: 60, filter: "blur(20px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            whileHover={{
              rotateX: mousePos.y * -3,
              rotateY: mousePos.x * 3,
              transition: { type: "tween", ease: "easeOut", duration: 0.4 }
            }}
            className="w-full max-w-[480px] transform-gpu relative group"
            style={{ perspective: 1200 }}
          >
            {/* Background Light Halo behind Panel */}
            <div className="absolute -inset-4 bg-gradient-to-b from-[var(--neon-cyan)]/20 to-[var(--neon-purple)]/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            {/* Float Animation Wrapper for Panel */}
            <div className="animate-[float_6s_ease-in-out_infinite]">
              {/* 
                Refined Panel: Extreme minimal glass layer, soft blur, glowing edges.
                No heavy box, just implied structure.
              */}
              <div className="relative backdrop-blur-[60px] bg-white/[0.01] rounded-[2.5rem] p-10 lg:p-14 shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden">
                
                {/* Glowing Subtle Border Edges (Masked) */}
                <div className="absolute inset-0 rounded-[2.5rem] p-[1px] bg-gradient-to-br from-[var(--neon-cyan)]/30 via-transparent to-[var(--neon-purple)]/10 [mask-composite:exclude] pointer-events-none" style={{ maskImage: "linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)", maskClip: "content-box, border-box" }} />
                
                {/* Soft Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent mix-blend-overlay pointer-events-none" />

                {/* Header Section */}
                <div className="space-y-4 mb-16 relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                    />
                    <span className="text-[10px] font-bold text-[var(--neon-cyan)] tracking-[0.3em] uppercase opacity-80">
                      System Uplink
                    </span>
                  </div>

                  <h1 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-[var(--neon-purple)]/60 tracking-tighter leading-[1.1] drop-shadow-sm pb-1">
                    Enter the AI<br />Career System
                  </h1>
                  <p className="text-sm font-light text-[var(--neon-cyan)]/60 tracking-wide pt-2">
                    Secure neural authentication required.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative px-5 py-4 mb-8 bg-red-500/10 border-l-[3px] border-red-500 rounded-r-xl overflow-hidden backdrop-blur-md"
                    >
                      <p className="text-xs text-red-200 font-medium tracking-wide">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative z-10">
                  {/* Premium Button Effect */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full relative group/btn outline-none"
                  >
                    {/* Hover Drop Shadow / Glow Expansion Outward */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-purple)] to-[var(--neon-blue)] rounded-2xl blur-xl opacity-20 group-hover/btn:opacity-70 transition-opacity duration-700 ease-out" />
                    
                    {/* Animated gradient shift button body */}
                    <div className="relative w-full bg-gradient-to-r from-[#0a1532]/90 via-[#050b1a]/90 to-[#0a1532]/90 bg-[length:200%_auto] hover:bg-right backdrop-blur-3xl border border-[var(--neon-cyan)]/40 hover:border-[var(--neon-cyan)]/70 rounded-2xl p-[1px] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_30px_rgba(0,0,0,0.5)] group-hover/btn:-translate-y-1.5 group-hover/btn:shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_20px_40px_rgba(52,211,153,0.3)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      
                      {/* Intermittent Light Sweep passing across the button every few seconds */}
                      <div className="absolute inset-0 -translate-x-[200%] skew-x-[-25deg] w-[60%] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[sweep-intermittent_4s_ease-in-out_infinite]" />
                      
                      <div className="relative w-full h-full bg-[#020512]/60 rounded-[15px] px-6 py-5 flex items-center justify-between z-10">
                        <div className="flex items-center gap-5">
                          {loading ? (
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-[var(--neon-cyan)]/30 overflow-hidden shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                              <Loader2 className="w-5 h-5 text-[var(--neon-cyan)] animate-spin" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover/btn:shadow-[0_0_20px_rgba(255,255,255,0.8)] group-hover/btn:scale-110 transition-all duration-500 ease-out">
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                              </svg>
                            </div>
                          )}
                          <div className="flex flex-col items-start text-left">
                            <span className="text-white font-bold tracking-wide text-base group-hover/btn:text-white transition-colors">
                              {loading ? "Establishing Link..." : "Authenticate via Google"}
                            </span>
                          </div>
                        </div>

                        {/* Right side interactive arrow */}
                        <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center bg-transparent group-hover/btn:opacity-100 group-hover/btn:bg-[var(--neon-cyan)]/20 group-hover/btn:border-[var(--neon-cyan)]/50 transition-all duration-500 transform group-hover/btn:translate-x-2">
                          <ChevronRight className="w-4 h-4 text-white/30 group-hover/btn:text-[var(--neon-cyan)] transition-colors" />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-16 text-center lg:text-left relative z-10">
                  <Link href="/" className="inline-flex items-center gap-2 text-[10px] text-white/20 uppercase tracking-[0.2em] hover:text-[var(--neon-purple)] transition-colors group">
                    <span className="inline-block w-4 h-[1px] bg-white/20 group-hover:bg-[var(--neon-purple)] transition-colors" />
                    Return to Mainframe
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Global CSS for unique cinematic animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes sweep-intermittent {
          0%, 30% { transform: translateX(-200%) skewX(-25deg); }
          50%, 100% { transform: translateX(300%) skewX(-25deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.05); }
        }
        @keyframes breathing {
          0%, 100% { transform: scale(1); box-shadow: 0 0 100px rgba(52,211,153,0.3), inset 0 0 60px rgba(255,255,255,0.3); }
          50% { transform: scale(1.02); box-shadow: 0 0 140px rgba(52,211,153,0.6), inset 0 0 80px rgba(255,255,255,0.5); }
        }
        @keyframes breathing-glow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.6; }
        }
        @keyframes plasma-wave {
          0% { transform: translateY(20%); opacity: 0.3; }
          100% { transform: translateY(-20%); opacity: 0.7; }
        }
        @keyframes slide-diagonal {
          0% { transform: translate(-10%, -10%); }
          100% { transform: translate(10%, 10%); }
        }
        .rotate-x-60 { transform: rotateX(65deg); }
        .rotate-x-75 { transform: rotateX(75deg); }
        .-rotate-y-20 { transform: rotateY(-20deg); }
        .rotate-y-12 { transform: rotateY(12deg); }
        .rotate-y-6 { transform: rotateY(6deg); }
      `}} />
    </div>
  )
}
