# 🚀 Linkbird.ai UI Replication - Internship Assignment

![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=nextdotjs)  
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)  
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-blueviolet)  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)  
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-orange)  
![TanStack Query](https://img.shields.io/badge/TanStack_Query-React_Query-red)  
![Zustand](https://img.shields.io/badge/Zustand-State_Management-yellow)  
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)  

This project is built as part of the *[Internship] Kandid - Full Stack Developer Next.js Intern Assignment*.  
It replicates the *Leads* and *Campaigns* sections of the Linkbird.ai platform with modern, responsive design and full functionality.

---

## 📌 Features Implemented

### 🔐 Authentication
- Email/password registration & login
- Google OAuth integration
- Session management & logout
- Protected routes with middleware
- Responsive, clean auth UI with validation & error handling

### 🖥 Application Layout & Navigation
- Collapsible sidebar navigation (Dashboard, Leads, Campaigns, Settings)
- Active state indicators
- User profile with logout
- Header with breadcrumbs
- Consistent typography & spacing

### 📊 Leads Section
- Infinitely scrollable leads table
- Columns: Name, Email, Company, Campaign, Status, Last Contact
- Search & filter functionality
- Skeleton UI & loading states
- Lead detail *side sheet*:
  - Contact details, campaign info, interaction history
  - Lead status progression
  - Action buttons (Contact, Update Status)
  - Smooth animations & close actions

### 🎯 Campaigns Section
- Campaigns overview table
- Columns: Name, Status, Total Leads, Successful Leads, Response Rate, Progress, Created Date, Actions
- Sortable columns & status filters
- Campaign statistics with progress bars & color-coded indicators
- Summary cards showing overall metrics

---

## 🛠 Tech Stack

- *Next.js 15+* – React framework (App Router)
- *Tailwind CSS + shadcn/ui* – Styling & UI components
- *PostgreSQL + Drizzle ORM* – Database & type-safe ORM
- *Better Auth* – Authentication (Email/Password + Google OAuth)
- *TanStack Query (React Query)* – Server state management
- *Zustand* – Client-side state management
- *TypeScript* – Type safety & scalability

---

## 🗄 Database Schema

- *Users* – Handled by Better Auth  
- *Campaigns* – Stores campaign details & metrics  
- *Leads* – Stores lead information, status, and associations  

---

## ⚡ State Management

- *Zustand* for UI & local states (sidebar, filters, modals)  
- *TanStack Query* for data fetching, caching, infinite scrolling, and optimistic updates  

---

## 🎨 UI/UX

- Matches *Linkbird.ai demo video* design
- Uses *shadcn/ui* consistently
- Hover states, transitions, and animations
- *Dark/Light theme support* (bonus)
- Fully responsive & accessible design

---

## 📂 Project Structure

```plaintext
LinkBird-AI/
├── public/               # Static assets (images, icons, favicon, etc.)
├── src/                  # Application source code (React components, pages, logic)
├── supabase/             # Supabase configuration and database/auth scripts
├── .env                  # Environment variables (API keys, DB config)
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
├── bun.lockb             # Dependency lock file for Bun package manager
├── components.json       # UI components configuration
├── eslint.config.js      # ESLint configuration for linting and code style
├── index.html            # Entry HTML file for Vite
├── package-lock.json     # Lock file for npm dependencies
├── package.json          # Project dependencies and scripts
├── postcss.config.js     # PostCSS configuration (used with Tailwind CSS)
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.app.json     # TypeScript config for the application
├── tsconfig.json         # Root TypeScript configuration
├── tsconfig.node.json    # TypeScript config for Node-related settings
└── vite.config.ts        # Vite configuration file

