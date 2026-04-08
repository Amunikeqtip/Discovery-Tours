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

2. Review `appsettings.json` and update the SMTP values:

```bash
notepad appsettings.json
```

Optional: create `appsettings.local.json` for machine-specific overrides. Any values in that file override `appsettings.json` and it is ignored by git.

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Mail Settings

```json
{
  "mail": {
    "fromName": "Victoria Falls Discovery Tours",
    "fromAddress": "noreply@shearwatervf.com",
    "brandLink": "https://discovery-tours.vercel.app/",
    "adminRecipients": [
      "tedwell@outlook.com",
      "amunikesibanibani@outlook.com"
    ],
    "transport": {
      "mode": "smtp",
      "smtp": {
        "host": "smtp.itanywhere.africa",
        "port": 587,
        "user": "noreply@shearwatervf.com",
        "pass": "replace-with-secure-password",
        "secure": true
      },
      "file": {
        "outputDirectory": ".mail-drop"
      }
    }
  }
}
```

Set `mail.transport.mode` to `smtp` for live delivery. Use `file` to write `.eml`, `.html`, and `.json` previews into `.mail-drop` for local template verification.

## Email Verification

Build the app, then run the contact-email verifier:

```bash
npm run build
npm run test:email
```

The verifier executes the built `POST /api/contact` route, generates the admin and guest email outputs, and confirms that the admin email contains the expected template content.

## Contact Flow

The contact form posts to `POST /api/contact`, validates the request with Zod, and sends the inquiry through the configured mail transport. Mail settings are read server-side from `appsettings.json` with optional local overrides from `appsettings.local.json`.
