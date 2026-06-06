# JobFlow — How to Run

## Prerequisites
- Node.js v18+ installed
- A GitHub account
- A Supabase account (free)

---

## 1. Install Dependencies

```powershell
cd D:\Projects\jobflow
npm install
```

---

## 2. Set Up Environment Variables

Make sure `.env` exists at `D:\Projects\jobflow\.env`:

```env
DATABASE_URL="your-supabase-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GITHUB_ID="your-github-oauth-client-id"
GITHUB_SECRET="your-github-oauth-client-secret"
```

---

## 3. Set Up GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** `JobFlow`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and **Client Secret** into `.env`

---

## 4. Push Database Schema

```powershell
.\node_modules\.bin\prisma db push
```

This creates all required tables in your Supabase database.

---

## 5. Run the App

```powershell
npm run dev
```

Open your browser and go to:
```
http://localhost:3000
```

---

## 6. Sign In & Get Started

- Click **"Continue with GitHub"**
- You'll land on the Kanban board
- Click **"Sample Data"** to load dummy jobs (only shows on empty board)
- Or click **"+ Add Job"** to add your first application

---

## Features

| Feature | Description |
|---------|-------------|
| 📋 Kanban Board | Drag & drop cards across 5 stages |
| ⚡ Quick Advance | One-click button to move job to next stage |
| 🔍 Search & Filter | Filter by company, role, or priority |
| 📊 Stats View | Charts showing application pipeline & progress |
| 🎉 Offer Celebration | Confetti animation when you land an offer |
| 🚨 Deadline Tracking | Overdue deadlines highlighted in red |
| 🎨 Priority Flags | Color-coded cards by High/Medium/Low priority |

---

## Kanban Stages

| Stage | Description |
|-------|-------------|
| **Wishlist** | Jobs you want to apply to |
| **Applied** | Applications submitted |
| **Interview** | Active interview process |
| **Offer** | Received an offer 🎉 |
| **Rejected** | Closed applications |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | NextAuth.js (GitHub OAuth) |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Icons | Lucide React |

---

## Folder Structure

```
jobflow/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── jobs/                 # CRUD for job applications
│   │   │   └── [id]/             # Update & delete by ID
│   │   └── seed/                 # Load sample data
│   ├── dashboard/                # Main Kanban board page
│   └── login/                    # Login page
├── components/
│   ├── Confetti.tsx              # Offer celebration animation
│   ├── DroppableColumn.tsx       # DnD column wrapper
│   ├── JobCard.tsx               # Individual job card
│   ├── JobModal.tsx              # Add/edit job form
│   ├── KanbanBoard.tsx           # Main board with DnD logic
│   ├── Logo.tsx                  # Custom SVG logo
│   └── StatsView.tsx             # Charts & statistics
├── lib/
│   ├── auth.ts                   # NextAuth config
│   └── prisma.ts                 # Prisma client
├── prisma/
│   └── schema.prisma             # Database schema
└── .env                          # Environment variables
```
