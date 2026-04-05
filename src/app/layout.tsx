import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ResumeAI — AI-Powered Career Operating System",
  description: "Build, tailor, and score your perfect resume with deterministic templates, JD-targeted tailoring, ATS scoring analytics, and secure private vault.",
  keywords: ["resume builder", "ATS score", "job description tailoring", "AI resume", "career tools"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} font-sans antialiased bg-[#0a1a14] text-foreground`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
