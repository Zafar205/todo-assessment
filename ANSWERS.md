## Technical Assessment Answers

**1. How to run**
See `README.md`.

**2. Stack choice**
Next.js (App Router) + Supabase + Resend. Supabase handles auth and Postgres with RLS out of the box. Resend's native `scheduled_at` parameter eliminates the need for a cron job or background worker entirely — the reminder feature is just an API call. Kept the stack minimal and deployable with zero extra infrastructure.

**3. One real edge case**
DB insert succeeds but Resend fails. The todo route wraps the Resend call in a `try...catch` after the Supabase insert, so a Resend outage doesn't fail the whole request or confuse the user into thinking their todo wasn't saved. The task is always persisted; the reminder fails silently. The gap is that the user gets no feedback — ideally a warning toast would surface if scheduling failed.

**4. AI usage**
~80% AI-generated. I used GitHub Copilot to scaffold the core structure, API routes, and Supabase auth flow. I manually fixed environment configuration issues, corrected a Supabase SSR client bug with the auth callback, and wired up a few integration details the AI got wrong.

**5. Honest gap**
No UI feedback if the reminder fails to schedule. I'd add a warning flag in the API response and a toast on the frontend so the user knows their email won't arrive. I'd also add validation to reject past reminder dates before hitting the API.
