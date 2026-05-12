# Smart Brains Kenya — Class Promotion Request Form

A mobile-first web app that lets Smart Brains Kenya tutors submit class promotion requests from school campuses. Submissions are written directly to a Google Sheet via Google Apps Script.

---

## Overview

Tutors fill in a 5-step wizard form and hit **Submit**. The data lands in the promotion tracking spreadsheet — no login, no backend, no friction.

| Step | Fields |
|------|--------|
| 1 | School Name, Grade Being Promoted |
| 2 | Course Promoted To |
| 3 | Class Start Time, Class End Time |
| 4 | Lead Tutor Name, Lead Tutor Contact, Assistant Tutor Name |
| 5 | Person Communicated To → **Submit** |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form v7 + Zod v4 |
| Data | Google Apps Script Web App → Google Sheets |
| Hosting | Vercel (free tier) |

---

## Local Development

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Create your local env file (see Environment Variables below)
echo 'NEXT_PUBLIC_GAS_URL=your_gas_url_here' > .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GAS_URL` | The deployed Google Apps Script Web App URL |

Create `.env.local` in the project root:

```
NEXT_PUBLIC_GAS_URL=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
```

> **Never commit `.env.local` to version control.**

---

## Google Apps Script Setup

The form POSTs JSON to a Next.js API route (`/api/submit`) which proxies the request server-side to your GAS Web App. This avoids browser CORS restrictions entirely.

### `doPost` function

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp,
    data.school,
    data.grade,
    data.course,
    data.startTime,
    data.endTime,
    data.leadName,
    data.leadContact,
    data.assistantName,
    data.communicatedTo,
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Deploying the GAS Web App

1. Open your Google Sheet → **Extensions → Apps Script**
2. Paste the `doPost` function above and save
3. Click **Deploy → New deployment**
4. Type: **Web app** | Execute as: **Me** | Who has access: **Anyone**
5. Click **Deploy** and copy the Web App URL
6. Paste it into `NEXT_PUBLIC_GAS_URL` in `.env.local` and in Vercel project settings

---

## Deploying to Vercel

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. In **Environment Variables**, add `NEXT_PUBLIC_GAS_URL` with the GAS Web App URL
4. Click **Deploy**

### Custom Domain (`promote.smartbrainskenya.com`)

1. In Vercel project → **Settings → Domains**, add `promote.smartbrainskenya.com`
2. In your DNS provider, add a **CNAME** record:
   - **Name:** `promote`
   - **Value:** `cname.vercel-dns.com`
3. Wait for DNS propagation (usually under 5 minutes on Cloudflare)

---

## Project Structure

```
promote-form/
├── app/
│   ├── api/submit/route.ts   # Server-side GAS proxy (resolves CORS)
│   ├── globals.css           # Tailwind import + step transition animations
│   ├── layout.tsx            # Root layout, Inter font, metadata
│   └── page.tsx              # Page shell (Header + PromotionForm)
├── components/
│   ├── FormField.tsx         # Label + input + error message wrapper
│   ├── Header.tsx            # Logo + app title
│   ├── PromotionForm.tsx     # 5-step wizard, all form logic
│   └── SuccessCard.tsx       # Confirmation screen after submission
├── lib/
│   ├── schema.ts             # Zod validation schema
│   └── submitForm.ts         # Fetch wrapper for /api/submit
└── public/
    └── logo.png              # Smart Brains Kenya logo
```

---

## Key Behaviour Notes

- **School name persists** across visits via `localStorage` — tutors don't retype it each time.
- **Per-step validation** — Next only advances when the current step's fields are valid.
- **Submit guard** — if any field on a prior step is invalid at submission, the form navigates back to that step and shows the error.
- **Offline detection** — error messages distinguish between no internet connection and a server failure.
- **No authentication** — intentionally public; access is restricted at the network level via Safaricom zero-rating (only `*.smartbrainskenya.com` is reachable without a data bundle).
