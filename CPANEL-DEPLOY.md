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

This produces `.output/` (server + static assets).

## 2. Upload

Upload to your app folder on the server (e.g. `/home/USER/hotstep`):

- `.output/`
- `app.js`
- `package.json`

Nothing else is required at runtime (all dependencies are bundled into
`.output/server`).

## 3. Create the Node.js app in cPanel

Setup Node.js App → Create Application:

- Node.js version: 20 or newer
- Application root: `hotstep` (the folder you uploaded to)
- Application URL: your domain
- Application startup file: `app.js`

Then click **Run NPM Install** (optional — the bundle is self-contained) and
**Restart**.

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

- **Redeploying:** rebuild, re-upload `.output/`, then Restart the app.
- **Subfolder installs** are not supported — host at a domain or subdomain root.
- If the domain shows the cPanel default page, make sure the domain's document
  root is the one Passenger created for the app and that `app.js` is set as the
  startup file.

## Simpler alternative

Publishing from Lovable needs no configuration and keeps image uploads working.
