# NUDGE 4.0 — Backend Ready 🐷

NUDGE now has a real cloud-backend integration path while preserving the browser-only prototype fallback.

## Included
- Responsive NUDGE 4.0 UI for laptop + phone
- Supabase Auth integration (email/password)
- Per-user cloud state
- PostgreSQL JSONB state store
- Row Level Security policies
- Cross-device session persistence
- Local fallback when Supabase credentials are blank
- No `service_role` key in frontend
- Backend setup instructions in `BACKEND_SETUP.md`
- Database policy/schema in `supabase_schema.sql`

## To activate cloud sync
1. Create a Supabase project.
2. Run `supabase_schema.sql` in SQL Editor.
3. Put the Project URL and anon/public key in `js/supabase-config.js`.
4. Enable Email provider in Authentication → Providers.
5. Serve the folder through a local web server or deploy it to a static host.

The current cloud storage intentionally uses one JSONB state document per account so we can migrate the existing NUDGE prototype without rebuilding every screen. Before production scale, split high-volume entities into their own tables and add server-side validation.


## Username-based greeting
The automatic time-of-day greeting uses the account's chosen username/display name, e.g. `Good morning, Shree`, `Good afternoon, Alex`, `Good evening, Maya`, or `Good night, Sam`. New accounts no longer use a hard-coded Shree greeting. The profile avatar also updates to the username's first letter.
