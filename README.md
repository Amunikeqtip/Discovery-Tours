# Victoria Falls Discovery Tours

A premium tourism and hospitality website built with Next.js, TypeScript, and SCSS modules. The site includes:

- Home page with service overviews and featured packages
- Packages page organized by Transfers, Accommodation, and Activities
- About page with detailed provider storytelling
- Contact page with an inquiry form that sends email through SMTP

## Tech Stack

- Next.js App Router
- TypeScript
- SCSS modules
- Nodemailer
- Zod validation

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file from the example and add your real SMTP values:

```bash
copy .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Required Environment Variables

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=
MAIL_FROM_NAME=
MAIL_FROM_ADDRESS=
ADMIN_CONTACT_EMAIL=
```

`ADMIN_CONTACT_EMAIL` is the inbox that receives contact form submissions.

## Contact Flow

The contact form posts to `POST /api/contact`, validates the request with Zod, and sends the inquiry through the configured SMTP account. SMTP values remain server-side and are never exposed to the client bundle.
