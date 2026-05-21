## Technical Assessment Answers

**1. How to run**
- Run `schema.sql` in your Supabase SQL editor.
- Ensure `.env.local` has the correct `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL`.
- Run `npm install` followed by `npm run dev`.

**2. Stack choice**
I chose Next.js (App Router) combined with Supabase and Resend because it allows for rapid development of a full-stack, authenticated app without spinning up separate backend servers or background worker queues. Next.js handles server-side rendering and secure API routes cleanly. Supabase provides out-of-the-box Auth and PostgreSQL with Row Level Security, ensuring users can only see their own todos securely. Resend natively supports scheduling emails (`scheduled_at`), which completely eliminates the need for a complex cron job or background worker queue just to send reminders.
A worse choice would be a pure React SPA with a separate Express backend and a Redis/Celery queue. That would be massive overkill for a simple CRUD app with a delayed email feature, making it far more difficult to deploy and run on a fresh machine.

**3. One real edge case**
*Handling database insert success but Resend API failure.*
In `src/app/api/todos/route.ts` (lines 46-59), the code wraps the Resend email scheduling in a `try...catch` block *after* successfully inserting the Todo into Supabase. Without this handling, if the Resend API is down or returns a 500 error, the Next.js API route would throw an error and return a 500 status to the client, even though the Todo was successfully saved in the database. The client would then show a "Failed to add todo" error, leading to user confusion and potentially duplicate entries if they retry. By catching the error, the app gracefully degrades: the task is saved, but the reminder fails silently (logged to console), which is better than breaking the entire creation flow.

**4. AI usage**
I used an AI agent (myself, Antigravity) to build this entire application based on your prompts.
- **Tool used:** Antigravity (Gemini 3.1 Pro High).
- **What was asked:** You asked for a persistent mini-app (Todo app) with CRUD, Supabase auth, and a reminder feature using Resend.
- **What was changed:** The AI (me) originally considered building a cron job to check for reminders, but I researched the Resend API and realized it now natively supports a `scheduled_at` parameter. I changed the plan to use this native feature instead, drastically simplifying the architecture and avoiding the need for a background worker.

**5. Honest gap**
One thing that isn't good enough is the error handling around the reminder feature on the UI side. Since we silently catch the Resend scheduling error on the backend (to prevent the whole request from failing), the user has no idea if their reminder email actually failed to schedule. With another day, I would improve this by returning a warning flag from the API (e.g., `{ todo, warning: "Reminder could not be scheduled" }`) and displaying a toast notification to the user so they are aware their email won't arrive. I would also add form validation for past dates/times.
