# NUDGE 4.0 — Backend setup

NUDGE 4.0 is now Supabase-ready. The browser app still works locally until cloud credentials are added.

## 1. Create the backend

Create a project in Supabase.

## 2. Create the database table

Open **SQL Editor** and run `supabase_schema.sql` from this folder.

The table is protected with Row Level Security. A signed-in user can only read/write the row whose `user_id` equals their Supabase Auth ID.

## 3. Configure the browser app

Open `js/supabase-config.js` and fill in:

- `url`: Supabase Project URL
- `anonKey`: Supabase anon/public key

Never put a Supabase `service_role` key in this file or any frontend file.

## 4. Configure email/password Auth

In Supabase → Authentication → Providers, enable Email.

For a simple first version, you can disable email confirmation while testing. For production, keep email confirmation enabled and configure your email provider.

## 5. Run NUDGE

Use a local web server rather than opening `index.html` directly. For example:

`python -m http.server 8000`

Then open `http://localhost:8000`.

## What cloud mode does

- Supabase Auth handles passwords and sessions.
- Each account gets a unique Supabase user ID.
- NUDGE stores that user's tasks, habits, Piggy Bank, calendar, notes, focus history, streaks, settings and roast history in their own `user_state` row.
- RLS prevents one authenticated user from reading another user's state.
- Multiple devices can load the same state after signing into the same account.
- Local mode remains available as a fallback when Supabase credentials are blank.

## Important prototype limitation

The current cloud table uses one JSONB document per user. This is deliberate for the current prototype because it lets us make the existing NUDGE UI cloud-sync quickly without rewriting every feature.

Before a large production launch, we should normalize high-volume entities (tasks, habits, reminders, events, notes, focus sessions, Piggy Bank entries) into separate tables and add server-side validation/audit rules.

## AI

Do not put an AI provider secret/API key in the frontend. When we add dynamic AI sarcasm, route it through a server-side function/edge function and return only the generated text to NUDGE.
