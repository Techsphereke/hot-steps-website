# Deploying to cPanel (plain shared hosting)

The public website is exported as **static HTML** — no Node.js app, no Passenger,
no "Setup Node.js App", no restarts. cPanel just serves files.

## 1. Build

```bash
npm install
npm run build:cpanel
```

Output: `dist/client/` — pre-rendered HTML for the home page, About Us, Diaspora,
Properties (list + every property + location filters), Blogs (list + every article),
Awards & Titles, Careers, Contact Us, plus `sitemap.xml`, `robots.txt`, all images
under `/media/` and `/brand/`, the favicon and a hidden `.htaccess`.

## 2. Upload

1. cPanel → **File Manager** → open `public_html` (or the domain's document root).
2. Delete the old files if you are replacing an existing site.
3. Upload **the contents of `dist/client/`** (not the folder itself). Easiest: zip the
   contents locally, upload the zip, then use **Extract**.
4. File Manager → **Settings → Show hidden files**, and confirm `.htaccess` is there.

That's it — the site is live immediately.

## 3. Check

- `https://yourdomain.com/`
- `https://yourdomain.com/properties/eden-ridge` (deep links work via `.htaccess`)
- `https://yourdomain.com/sitemap.xml`
- Images, logo and favicon all show

## Admin panel / live editing

The CMS (properties, hero slider, blogs, awards, team, pages, users) needs a server
runtime, so it is **not** part of the static export. Workflow:

1. Edit content in the admin panel on the Lovable URL (`/admin`).
2. Run `npm run build:cpanel` again.
3. Re-upload `dist/client/` — the new content is baked into the HTML.

If you want the admin panel and live content on your own domain instead, cPanel must
have **Setup Node.js App** (Node 20+) and we'd deploy the Node build instead of this
static one.

## Notes

- **Subfolder installs**: build with a base path
  `npx vite build --config vite.config.static.ts --base=/sub/` and change the
  `.htaccess` fallback targets to `/sub/index.html`.
- **HTTPS**: `.htaccess` forces HTTPS — install the free AutoSSL certificate first,
  otherwise remove that block.
- `npm run build` stays the Lovable/Cloudflare build; use `build:cpanel` for cPanel.
