# Repair the cPanel admin panel

## Goal
Make `/admin` open reliably from the flat `dist/` package and keep signed-in administrators able to manage website content.

## Changes
- Include the sign-in, password-reset, admin dashboard, and every admin subsection in the static build, so Apache serves the correct page instead of falling back to the homepage shell.
- Replace server-only content and settings calls in the static panel with authenticated browser database calls protected by the existing administrator policies.
- Keep the current role check tied to the signed-in account and show a recoverable message instead of crashing the whole page when a request fails.
- Make image uploads use the hosted backend path available to the deployed site; preserve pasted image URLs as a fallback.
- Keep sensitive user creation, role changes, deletion, and password administration behind verified super-admin server operations; do not expose privileged credentials in the static package.
- Regenerate and inspect the flat `dist/` output, then verify sign-in and `/admin` routing in a browser without server-function requests for normal content management.

## Technical details
- Update `vite.config.static.ts` with explicit static entries for `/auth`, `/reset-password`, `/admin`, and all `/admin/*` routes.
- Add a client-safe admin data module using the existing authenticated backend client and current row-level policies.
- Update the dashboard, collection manager, settings, and access-state handling to use that module.
- Retain server functions only for genuinely privileged account operations, with a clear hosting limitation if the cPanel domain has no application server endpoint.
