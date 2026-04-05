"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Activity, Cpu } from "lucide-react"

export function ProfileProgressCard({ percentage = 0 }: { percentage: number }) {
  const isComplete = percentage === 100
  
  return (
    <div className="relative mb-12 p-[1px] rounded-2xl overflow-hidden group">
      {/* Animated Gradient Border Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#34d399]/20 to-transparent translate-x-[-100%] group-hover:animate-[sweep_2s_linear_infinite]" />
      <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl" />
      
      {/* Soft Background Glow depending on completeness */}
      <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] pointer-events-none transition-colors duration-1000 ${isComplete ? 'bg-[#34d399]/10' : 'bg-[#f59e0b]/8'}`} />

      <div className="relative flex flex-col md:flex-row items-center justify-between p-6 md:p-8 rounded-2xl bg-[#0a1a14]/60 backdrop-blur-2xl border border-transparent z-10">
        
        {/* Left: Intelligence Status */}
        <div className="flex items-start gap-4 flex-1 mb-6 md:mb-0 w-full">
          <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 mt-1 shadow-inner relative overflow-hidden">
             {isComplete ? (
               <ShieldCheck className="w-5 h-5 text-[#34d399]" />
             ) : (
               <Activity className="w-5 h-5 text-white/50" />
             )}
             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#34d399]/10 to-transparent" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <h3 className="text-xl md:text-2xl font-light text-white tracking-tight">System Identity</h3>
               {!isComplete && (
                 <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[9px] font-bold text-[#f59e0b]/80 uppercase tracking-widest">Compiling</span>
               )}
               {isComplete && (
                 <span className="px-2 py-0.5 rounded-full bg-[#34d399]/10 border border-[#34d399]/20 text-[9px] font-bold text-[#34d399] uppercase tracking-widest flex items-center gap-1">
                    <Cpu className="w-2.5 h-2.5" />
                    Optimized
                 </span>
               )}
            </div>
            <p className="text-[#a1a1aa] text-sm md:text-[15px] max-w-lg leading-relaxed font-medium">
              {isComplete 
                ? "Your architecture is mathematically optimal. Ready for immediate ATS extraction and targeting." 
                : "A complete architecture inherently maximizes deterministic ATS parsing. Supplying more timeline data increases matching coefficients."
              }
            </p>
          </div>
        </div>

        {/* Right: Data Visualization */}
        <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-2 sm:mt-0 shrink-0">
           <div className="flex items-center gap-4 w-full justify-between md:justify-end">
             <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">Data Saturation</span>
             <span className={`text-4xl font-light tracking-tighter ${isComplete ? 'text-[#34d399] drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]' : 'text-white'}`}>
                {percentage}%
             </span>
           </div>
           <div className="h-1.5 w-full md:w-64 bg-black/50 rounded-full overflow-hidden shrink-0 border border-white/5 relative shadow-inner">
             {/* Dynamic Loading Bar */}
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${percentage}%` }}
               transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
               className={`absolute top-0 left-0 bottom-0 ${isComplete ? 'bg-[#34d399] shadow-[0_0_10px_#34d399]' : 'bg-[#f59e0b]/60'}`}
             >
               <div className="w-full h-full bg-gradient-to-r from-transparent to-white/20" />
               {!isComplete && <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-r from-transparent to-white/40 cinematic-sweep" />}
             </motion.div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  )
}
