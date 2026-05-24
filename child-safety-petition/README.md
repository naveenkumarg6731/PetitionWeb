# Tamil Child Safety Petition Website

Modern responsive Tamil petition platform built with React, Tailwind CSS, Firebase, Signature Pad, and Framer Motion.

## Features

- Tamil-first modern UI with dark red + white theme
- Mobile responsive hero, petition content, and supporter sections
- Top awareness banner
- Signature form with:
	- Full Name
	- Phone Number
	- District
	- Signature canvas
- Firebase Firestore + Storage integration
- Duplicate phone number prevention
- Live supporter list with name, district, signature image, and date
- Floating WhatsApp share button
- Petition PDF download button
- SEO meta tags and Tamil font support
- Reusable admin-ready folder structure

## Tech Stack

- React (Vite)
- Tailwind CSS v4
- Firebase (Firestore + Storage)
- react-signature-canvas
- Framer Motion
- jsPDF

## Folder Structure

src/
- components/
	- FloatingWhatsAppButton.jsx
	- HeroSection.jsx
	- PetitionContent.jsx
	- SignatureForm.jsx
	- SupportersSection.jsx
	- TopBanner.jsx
- constants/
	- petitionText.js
- services/
	- firebase.js
	- petitionService.js
- utils/
	- downloadPetitionPdf.js
- App.jsx
- index.css
- main.jsx

## Setup

1. Install dependencies:

npm install

2. Create .env from .env.example and fill Firebase values.

3. Run dev server:

npm run dev

4. Build production:

npm run build

## Firebase Notes

- Firestore collection: supporters
- Supporter document id: normalized phone number
- Signature storage path: signatures/{phone}_{timestamp}.png

This structure is ready for adding an admin panel in a separate route or dashboard module.
