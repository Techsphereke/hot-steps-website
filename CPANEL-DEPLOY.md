# Deploying to cPanel

This app is server-rendered (TanStack Start + Nitro), so cPanel must have
**Setup Node.js App** (Phusion Passenger, Node 20+). Static-only hosting will
not run the pages, the admin panel, or the media proxy.

## 1. Build for Node

Locally (or on a machine with Node 20+):

```bash
npm install
npm run build:cpanel     # NITRO_PRESET=node-server
```

This produces `dist/` — `dist/server` (Node server) and `dist/client` (static assets).

## 2. Upload

Extract the deployment zip directly into your app folder (for example
`/home/USER/hotstep`). The app folder itself must contain:

- `dist/`
- `app.js`
- `package.json`

Do not leave these files inside an extra `hotstep-cpanel/` folder. The required
path is `/home/USER/hotstep/dist/server/index.mjs`, not
`/home/USER/hotstep/hotstep-cpanel/dist/server/index.mjs`.

Nothing else is required at runtime. The download contains a minimal
`package.json`; all runtime code is already bundled into `dist/server`.

## 3. Create the Node.js app in cPanel

Setup Node.js App → Create Application:

- Node.js version: 20 or newer
- Application root: `hotstep` (the folder you uploaded to)
- Application URL: your domain
- Application startup file: `app.js`

Do **not** run NPM Install for the prepared deployment zip; it is self-contained.
Click **Restart** after uploading and after every environment-variable change.

## 4. Environment variables

In the same screen, add these under *Environment variables*:

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | same as in `.env` |
| `SUPABASE_PUBLISHABLE_KEY` | same as in `.env` |
| `VITE_SUPABASE_URL` | same as in `.env` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | same as in `.env` |
| `SUPABASE_SERVICE_ROLE_KEY` | your backend service-role key (required for images) |

Restart the app after saving.

## 5. Notes / limitations

- **Media uploads:** uploading and serving images both run server-side through
  `SUPABASE_SERVICE_ROLE_KEY`. The browser never sees that key — the admin
  uploader posts the file to the server, which stores it in the private media
  bucket, and `/api/public/media/*` streams it back. Set the variable above and
  uploads work on cPanel exactly as they do on Lovable. Leave it unset and
  everything else (pages, SEO, listings, blogs) still works, but images added
  through the admin panel will not upload or display.

- **Redeploying:** rebuild, re-upload `dist/`, then Restart the app.
- **Subfolder installs** are not supported — host at a domain or subdomain root.
- If the domain shows the cPanel default page, make sure the domain's document
  root is the one Passenger created for the app and that `app.js` is set as the
  startup file.
- If cPanel reports a startup error, verify Node.js 20+ is selected and check
  that `dist/server/index.mjs` exists directly under the Application root.

## Simpler alternative

Publishing from Lovable needs no configuration and keeps image uploads working.
