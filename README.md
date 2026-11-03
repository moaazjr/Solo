# Solo: company website

The official website of a one-human technology company: one founder leading a team of AI agents.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · PostgreSQL + Prisma 7 · Nodemailer · Framer Motion · Zod + React Hook Form · Lucide.

---

## 1. Requirements

- Node.js 20+ (tested on Node 24)
- A PostgreSQL database. A free [Neon](https://neon.tech) database is the easiest option and also works in production.
- An SMTP account for lead notifications. For Gmail, use an **App Password**: Google Account → Security → 2-Step Verification → App passwords.

## 2. Setup

```bash
npm install                 # also generates the Prisma client
cp .env.example .env        # then fill in the values (see comments in the file)
npm run db:deploy           # apply database migrations
npm run db:seed             # load services, sample projects and placeholder testimonials
npm run admin:create        # create the admin account from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev                 # http://localhost:3000
```

The admin dashboard is at `/admin`. After creating the admin account you can delete `ADMIN_PASSWORD` from `.env`.

## 3. Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run typecheck` | Generate route types and run TypeScript |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create a new migration after editing `prisma/schema.prisma` (development) |
| `npm run db:deploy` | Apply migrations (production / CI) |
| `npm run db:seed` | Seed or refresh the default content |
| `npm run db:studio` | Browse the database in Prisma Studio |
| `npm run admin:create` | Create the admin, or reset their password (this also signs out all sessions) |

## 4. Project structure

```
prisma/              schema, migrations, seed
scripts/             create-admin
src/
  app/(site)/        public pages: home, about, services, projects, contact, legal
  app/admin/         login + protected dashboard (leads, projects, services)
  app/               sitemap, robots, OG image, icon, 404
  actions/           server actions: lead submission, auth, admin CRUD
  components/        ui/, layout/, sections/, projects/, contact/, admin/, motion/
  config/site.ts     company name, contact details, socials  ← edit me
  content/company.ts stats, values, process, team copy        ← edit me
  lib/               db, data (cached queries), email, auth, rate-limit, security, seo
  validation/        Zod schemas shared by client and server
  proxy.ts           optimistic admin route guard
```

## 5. How the contact form works

1. The form is validated in the browser (Zod + React Hook Form), then again on the server.
2. Spam protection: a hidden honeypot field, a minimum time to fill in the form, rate limiting (3 per 10 minutes and 10 per day per visitor), and duplicate detection. Visitor IPs are stored only as salted hashes.
3. All input is sanitised (HTML stripped). The email's domain must be able to receive mail (it needs MX or A records, so typos and made-up domains are rejected), and the selected service is checked against the database. If DNS is unreachable, the domain check is skipped rather than blocking real visitors.
4. The lead is saved to PostgreSQL. **If saving fails, no email is sent.**
5. After the response is sent, a notification email goes to `LEAD_NOTIFICATION_EMAIL`. If sending fails, the lead is kept and the error is shown on the lead in the dashboard.

## 6. Admin security

- Passwords are hashed with bcrypt (cost 12). Failed logins are rate-limited (5 per 15 minutes per IP).
- Sessions are stored in the database and referenced by a signed (HS256) `httpOnly` cookie that lasts 8 hours.
- `proxy.ts` rejects requests without a valid signed cookie. Every admin page and server action also runs a full check against the database (`requireAdmin()`).
- Admin pages are marked `noindex` and are blocked in `robots.txt`.

## 7. Deploying (Vercel + Neon)

1. Push the repository to GitHub and import it into Vercel.
2. Add every variable from `.env.example` in Vercel → Settings → Environment Variables. Set `NEXT_PUBLIC_SITE_URL` to your real domain.
3. No build settings are needed: the `vercel-build` script runs `prisma migrate deploy && next build`, so migrations apply on every deploy.
4. Run `npm run db:seed` and `npm run admin:create` once against the production database (from your machine, with the production `DATABASE_URL`).

## 8. Placeholder content to replace

- `src/config/site.ts`: company name, legal name, founder name, social links.
- `src/content/company.ts`: the founder's team card.
- Sample projects and testimonials: edit them in `/admin` (testimonials via `prisma/seed.ts` or Prisma Studio). Sample projects are labelled "Sample project" on the site until you untick **Sample / placeholder**.
- Privacy Policy and Terms: template text, to be reviewed by a legal professional before launch.
