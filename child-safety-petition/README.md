# குழந்தைகள் பாதுகாப்புக்கான மக்கள் குரல்

Public Petition for Child Safety in Tamil Nadu.

Modern Tamil + English campaign website built with React, Tailwind CSS, Netlify Functions + Blobs, Framer Motion, and React Signature Canvas.

## Highlights

- Emotional fullscreen hero section with campaign CTA
- Auto-open digital sign modal on first load
- Draw signature or upload signature with live preview
- Netlify Functions + Blobs supporter data pipeline
- Duplicate mobile prevention and client anti-spam cooldown
- Live public supporters grid with signature images
- Recent supporters ticker animation
- Animated counters: total, districts, today
- Social share: WhatsApp, Facebook, Twitter/X, Copy link
- PDF report export for petition and summary stats
- Protected admin dashboard with Netlify function-based login
- Admin tools: filter by district, delete entries, CSV export, signatures ZIP download, PDF report
- Glassmorphism UI, particle background, smooth motion, dark mode toggle
- Tamil typography optimized with Noto Sans Tamil

## Tech Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- Netlify Functions
- Netlify Blobs
- react-signature-canvas
- jsPDF
- PapaParse
- JSZip + FileSaver

## Project Structure

src/
- components/
	- admin/
		- AdminTable.jsx
		- AdminToolbar.jsx
	- ui/
		- ParticleBackground.jsx
		- RecentSupportersTicker.jsx
		- SocialShareButtons.jsx
		- SuccessPopup.jsx
		- ThemeToggle.jsx
	- CountersSection.jsx
	- FloatingWhatsAppButton.jsx
	- FooterSection.jsx
	- HeroSection.jsx
	- PetitionContent.jsx
	- SignatureModal.jsx
	- SupportersSection.jsx
	- TopBanner.jsx
- constants/
	- petitionText.js
- contexts/
	- AuthContext.jsx
- hooks/
	- useAuth.js
- pages/
	- AdminDashboardPage.jsx
	- AdminLoginPage.jsx
	- NotFoundPage.jsx
	- PublicPetitionPage.jsx
- services/
	- authService.js
	- petitionService.js
- utils/
	- reportUtils.js
- App.jsx
- index.css
- main.jsx

## Netlify Environment Variables

Set these in Netlify Site Settings -> Environment Variables:

- NETLIFY_ADMIN_EMAIL
- NETLIFY_ADMIN_PASSWORD
- NETLIFY_ADMIN_TOKEN

## Data Model

Blob Store: supporters

Fields:
- id
- name
- mobile
- district
- message
- signatureUrl
- createdAt

## Local Development

1. npm install
2. npm run dev
3. Open http://localhost:5173

Note: Full Netlify Function testing is done in Netlify deploy (or with netlify dev).

## Production Build

1. npm run build
2. npm run preview

## Deploy to Netlify

1. Push repository to GitHub.
2. Import project in Netlify.
3. Set root directory: child-safety-petition
4. Build command: npm run build
5. Publish directory: dist
6. Add Netlify environment variables listed above.
7. Deploy.

Netlify config is pre-added in:
- ../netlify.toml
- public/_redirects
- netlify/functions/*

## API Endpoints (Netlify Functions)

- /.netlify/functions/submit-supporter
- /.netlify/functions/supporters
- /.netlify/functions/admin-login
- /.netlify/functions/delete-supporter
6. Deploy.

## Admin Access

- URL: /admin/login
- Login with Firebase Auth admin credentials.
- Access /admin for management and exports.
