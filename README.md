<div align="center">
  <img src="public/favicon.ico" alt="Logo" width="80" height="80">
  <h1 align="center">🚀 AI Resume Builder Platform</h1>
  
  <p align="center">
    <strong>A next-generation, motion-rich resume builder powered by Artificial Intelligence.</strong>
    <br/>
    Create, customize, and export professional resumes with a premium, interactive user experience.
  </p>

  <p align="center">
    <a href="#features"><strong>✨ Features</strong></a> ·
    <a href="#tech-stack"><strong>💻 Tech Stack</strong></a> ·
    <a href="#getting-started"><strong>🚀 Getting Started</strong></a> ·
    <a href="#folder-structure"><strong>📂 Structure</strong></a>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-DB/Auth-green?style=for-the-badge&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  </p>
</div>

<hr />

## 🌟 Overview

The **AI Resume Platform** revolutionizes the way job seekers build their CVs. By combining cutting-edge WebGL (Three.js), silky smooth animations (Framer Motion), and real-time AI capabilities, we've created a luxurious and cinematic experience for crafting professional resumes. Stop fighting with Word documents and let our platform design an ATS-friendly, visually stunning resume.

## ✨ Key Features

- 🤖 **AI-Powered Generation**: Instantly generate phrasing, bullet points, and summaries tailored to your target role.
- 🎨 **Premium UI/UX**: A state-of-the-art interface utilizing **Three.js** and **React Three Fiber** for immersive landing pages and premium interactions.
- 🎬 **Fluid Animations**: High-fidelity motion design across the application powered by **Framer Motion**.
- 📄 **High-Quality PDF Export**: 1-click seamless export to PDF using `html2canvas-pro` and `jspdf`, guaranteeing your resume looks exactly how you designed it.
- 🔐 **Secure & Fast Auth**: Reliable authentication and real-time persistent data storage with **Supabase**.
- 📱 **Fully Responsive**: Flawless experience on desktop, tablet, and mobile devices.

## 🛠 Tech Stack

Our platform is built with modern, high-performance technologies:

### **Frontend:**
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) & [Base UI](https://base-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- **Data Visualization**: [Recharts](https://recharts.org/)

### **Backend & State:**
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### **Utility:**
- **PDF Generation**: `jspdf` & `html2canvas-pro`
- **Icons**: `lucide-react`

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/resume.git
cd resume
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory. You will need to add your Supabase credentials and other required keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Folder Structure

- `/src/app/(marketing)` - Our 3D, immersive landing pages
- `/src/app/app` - The core Resume Builder application
- `/src/app/auth` - Authentication routes (Login / Signup)
- `/src/components` - Reusable UI components (shadcn ui, custom elements)
- `/src/lib` - Utility functions, configurations, and Supabase client
- `/src/types` - TypeScript interfaces and types

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🛡 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ by the AI Resume Platform team
</p>
