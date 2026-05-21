# Todo App with Reminders

This is a Next.js application built for the technical assessment. It features full CRUD operations for Todos, Supabase Auth, and a scheduled email reminder feature powered by Resend.

## Tech Stack
- Next.js (App Router, Server Actions, API Routes)
- Supabase (PostgreSQL Database, Auth, Row Level Security)
- Resend (Scheduled Emails)
- Tailwind CSS

## Setup Instructions

### 1. Database Setup
You will need a Supabase project. In your Supabase SQL editor, run the script found in `schema.sql`.

### 2. Environment Variables
Create a `.env.local` file in the root directory (or use the one provided) and populate it:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nxky........lrkcsirv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_RfDiaaepQNCxAiO8K5............
RESEND_API_KEY=re_ULbKuHRd_2fRhfyJ.......................
RESEND_FROM_EMAIL=mohamedalzafar@alreadydead.shop
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000). You can sign up for a new account on the login page and start managing your Todos.
