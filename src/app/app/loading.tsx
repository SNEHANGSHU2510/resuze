export default function AppLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="relative w-14 h-14 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--neon-blue)]/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--neon-blue)] animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[var(--neon-cyan)] animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
        </div>
        <p className="text-xs text-white/30 tracking-widest uppercase">Loading</p>
      </div>
    </div>
  )
}
