# குழந்தைகள் பாதுகாப்புக்கான மக்கள் குரல்

Public Petition for Child Safety in Tamil Nadu.

Modern Tamil + English campaign website built with React, Tailwind CSS, Firebase, Framer Motion, and React Signature Canvas.

## Highlights

- Emotional fullscreen hero section with campaign CTA
- Auto-open digital sign modal on first load
- Draw signature or upload signature with live preview
- Firebase Firestore + Storage real-time supporter pipeline
- Duplicate mobile prevention and client anti-spam cooldown
- Live public supporters grid with signature images
- Recent supporters ticker animation
- Animated counters: total, districts, today
- Social share: WhatsApp, Facebook, Twitter/X, Copy link
- PDF report export for petition and summary stats
- Protected admin dashboard with Firebase Authentication
- Admin tools: filter by district, delete entries, CSV export, signatures ZIP download, PDF report
- Glassmorphism UI, particle background, smooth motion, dark mode toggle
- Tamil typography optimized with Noto Sans Tamil

## Tech Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- Firebase Auth, Firestore, Storage
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
	- firebase.js
	- petitionService.js
- utils/
	- reportUtils.js
- App.jsx
- index.css
- main.jsx

## Environment Variables

Copy .env.example to .env and provide real values.

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_ADMIN_EMAIL

## Firebase Setup

1. Create Firebase project.
2. Enable Authentication: Email/Password.
3. Create one admin user in Firebase Auth matching VITE_ADMIN_EMAIL.
4. Create Firestore database in production mode and collection supporters.
5. Enable Firebase Storage.
6. Add security rules to validate supporter shape and admin delete rights.

## Firestore Data Model

Collection: supporters

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

## Production Build

1. npm run build
2. npm run preview

## Deploy to Vercel

1. Push repository to GitHub.
2. Import project in Vercel.
3. Set root directory: child-safety-petition
4. Framework preset: Vite
5. Add all .env variables in Vercel project settings.
6. Deploy.

## Admin Access

- URL: /admin/login
- Login with Firebase Auth admin credentials.
- Access /admin for management and exports.
