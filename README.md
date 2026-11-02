# HR University (HRU)

> Gen-Z styled university website built with React and Vite.

## 🌐 Live Demo
- **Production URL**: Deployment in progress (link will be updated upon Vercel deployment)

---

## 🏛️ Project Overview
HR University is a modern, interactive university portal delivering a responsive campus experience for prospective students, faculty, recruiters, and visitors. Built with React and Vite, the platform combines fluid animations with high performance and accessibility across desktop and mobile devices.

> **Note on Architecture & Demo Data**:
> This website currently runs on client-side demo data. The API backend lives in the separate repository: [**hr-university-backend**](https://github.com/fenilrami27/hr-university-backend). Admissions and enquiry forms run in client demo mode until the backend service is hosted and connected.

---

## ✨ Features
- **Cinematic Animated Intro & Hero**: Dynamic video backdrop with fallback visuals, customizable intro sequence, and entrance transitions powered by Framer Motion.
- **Dynamic Counters & Stats**: Animated metrics for campus enrollment, faculty-to-student ratios, patent filings, research grants, and placement rates.
- **Interactive Admissions & Eligibility**: Step-by-step admissions application form with field validation, scholarship calculator, fee structures, and application timelines.
- **Academic Programs & Departments**: In-depth department showcases covering AI, Computer Science & Systems, Paramedical & Pharmaceutical Sciences, Sports Science & Biomechanics, Architecture, and Business & Venture Strategy.
- **Campus Life & Virtual Tour**: Interactive campus facilities explorer highlighting research supercomputing clusters, aeroponic biodomes, makerspaces, esports arenas, and libraries.
- **Events & Festival Calendar**: Cultural, technical, and sports calendar (Navratri Garba Raas, HackHRU Hackathon, Diwali Deepotsav, Academic Conclaves) with dedicated detail views.
- **Placements & Recruiter Network**: Placement statistics, tier-1 recruiting partner directories, student package percentiles, and recruiter enquiry flows.
- **Student Portal & Academic Updates**: Real-time mock dashboard for timetable releases, exam admit cards, SLURM cluster credentials, and academic results.
- **Accessible & Responsive**: Fully responsive layout with custom toast alerts, interactive modal lightboxes, and keyboard navigation.

---

## 🛠️ Tech Stack
- **Framework**: [React 18.3.1](https://react.dev/) (Single Page Application with React Router v7)
- **Build Tool**: [Vite 8.3.5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4.19](https://tailwindcss.com/)
- **Animation & Transitions**: [Framer Motion 14.7.1](https://www.framer.com/motion/), [GSAP 3.15.0](https://gsap.com/), and [Lenis 1.3.27](https://lenis.darkroom.engineering/)
- **Icons**: [Lucide React 1.63.0](https://lucide.dev/)
- **Micro-Interactions**: [Canvas Confetti 1.9.4](https://www.npmjs.com/package/canvas-confetti)
- **Linter & Code Quality**: [Oxlint 1.89.0](https://oxc.rs/)

---

## 📂 Project Structure
```text
hr-university/
├── public/                 # Static assets (favicons, SVG icons, event photography)
├── src/
│   ├── assets/             # Branding assets, vector doodles, and icons
│   ├── components/         # Reusable UI components (layout, common, ui, student)
│   ├── config/             # Navigation links, academic calendars, portal config
│   ├── data/               # Structured university data (departments, events, placements)
│   ├── lib/                # Motion presets, animation helpers, utility functions
│   ├── pages/              # Routed views (Home, Admissions, Departments, Events, etc.)
│   ├── sections/           # Modular landing page sections (Hero, Stats, Research, Life)
│   ├── services/           # API integration stubs (ready for backend connection)
│   ├── styles/             # Global CSS and custom design tokens
│   ├── App.jsx             # Main router configuration & layout scaffold
│   └── main.jsx            # React root mount point
├── .env.example            # Environment configuration template
├── .gitignore              # Ignored files (node_modules, build artifacts, secrets)
├── package.json            # Project dependencies and script definitions
├── vercel.json             # Vercel deployment routing and cache headers
├── tailwind.config.js      # Tailwind CSS theme configuration
├── vite.config.js          # Vite build and development configuration
└── README.md               # Repository documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9.0.0 or higher)

### 1. Installation
```bash
git clone https://github.com/fenilrami27/hr-university.git
cd hr-university
npm install
```

### 2. Environment Setup (Optional)
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
The development server starts on `http://localhost:5173` (or `http://localhost:5174` if 5173 is busy).

### 4. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 🚀 Deployment
This frontend is configured for deployment on [Vercel](https://vercel.com).
- **SPA Rewrites**: `vercel.json` routes all requests to `/index.html` to enable client-side routing on direct navigation or page refresh.
- **Cache Control**: Immutable long-term caching configured for `/assets/*` static bundles.
- **Security Headers**: Standard security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`) are attached to responses.

---

## 📄 Disclaimer & Copyright
© HR University demo project. All rights reserved. Images and videos are placeholders.
