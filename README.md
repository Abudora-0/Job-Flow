# JobFlow

A Kanban-style job application tracker. Drag and drop your applications through every stage of the hiring pipeline — from wishlist to offer — with deadline tracking, priority flags, and a statistics dashboard.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)

## Features

- **Kanban Board** — drag-and-drop cards across 5 stages: Wishlist → Applied → Interview → Offer → Rejected
- **Quick Advance** — one-click button to move an application to the next stage
- **Application Details** — company, role, location, salary, deadline, priority, notes, and applied date
- **Priority Flags** — color-coded High / Medium / Low badges on every card
- **Deadline Tracking** — overdue deadlines are highlighted in red automatically
- **Search & Filter** — filter by company name, role, or priority level
- **Statistics Dashboard** — pipeline charts showing application counts per stage
- **Offer Confetti** — celebration animation when an application reaches the Offer stage
- **Sample Data** — one-click seed to pre-populate the board for demos
- **GitHub OAuth** — sign in to keep your board private and persistent
- **View Toggle** — switch between the Board view and Stats view

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Auth | NextAuth.js 4 (GitHub OAuth) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 5 |
| Drag & Drop | dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`) |
| Charts | Recharts |
| Dates | date-fns |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. [Supabase](https://supabase.com/) free tier)
- A GitHub OAuth App ([create one here](https://github.com/settings/developers))

### Installation

```bash
git clone https://github.com/yourusername/jobflow.git
cd jobflow
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Database Setup

```bash
npx prisma migrate dev
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # GitHub OAuth
│   │   ├── jobs/                 # CRUD endpoints
│   │   └── seed/                 # Sample data loader
│   └── dashboard/                # Main Kanban board page
├── components/
│   ├── KanbanBoard.tsx
│   ├── DroppableColumn.tsx
│   ├── JobCard.tsx
│   └── Confetti.tsx
├── lib/
│   ├── auth.ts
│   └── prisma.ts
└── prisma/schema.prisma
```

## License

MIT
