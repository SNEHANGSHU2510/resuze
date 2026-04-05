"use client"

import * as React from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import { GlowButton } from "@/components/ui/glow-button"

interface Props {
  children: React.ReactNode
  fallbackMessage?: string
}

interface State {
  hasError: boolean
  errorMessage: string
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, errorMessage: "" }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[40vh] p-8">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-400/10 flex items-center justify-center mx-auto border border-red-400/20">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg text-white font-semibold">Something went wrong</h3>
            <p className="text-sm text-muted-foreground">
              {this.props.fallbackMessage || "An unexpected error occurred. Please try refreshing the page."}
            </p>
            {this.state.errorMessage && (
              <p className="text-xs text-red-400/60 font-mono bg-red-400/5 rounded-lg px-3 py-2 border border-red-400/10">
                {this.state.errorMessage}
              </p>
            )}
            <GlowButton
              variant="outline"
              onClick={() => {
                this.setState({ hasError: false, errorMessage: "" })
                window.location.reload()
              }}
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Reload Page
            </GlowButton>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
