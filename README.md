# Flora.ai (Lite) - Botanical Specimen Archive

Flora.ai is a professional-grade plant identification and gardening management interface. This version (Lite) is a privacy-focused deployment designed for Cloud Run, featuring a robust botanical gallery, a community interaction hub, and a personal garden specimen archive.

Live demo: https://remix-flora-ai-1276260204.asia-southeast1.run.app

## 🌿 Overview

This application serves as a digital companion for botanists, gardeners, and plant enthusiasts. It provides a structured way to explore botanical data, manage a private collection of plant specimens, and interact with a community of likeminded explorers.

### Key Features

- **Botanical Gallery:** A curated archive of plant species with scientific data, descriptions, and high-quality imagery.
- **Specimen Archive (Garden):** Save your own plant specimens with tactical data including acquisition dates, health status, and neural impressions (notes).
- **Tactical Data Export:** Generate professional PDF reports of your specimens for offline record-keeping.
- **Community Hub:** Share findings and discuss botanical insights with other members.
- **Privacy-First Design:** All AI processing is disabled in this build to prioritize local resource management and data privacy.
- **Glitch Art Interface:** A unique, high-contrast "Retro-Futurist" UI with screen-tearing animations and scanline effects.

## 🛠️ Tech Stack

- **React 19 & Vite:** Modern, lightning-fast frontend framework.
- **TypeScript:** Ensuring type-safety and robust code structure.
- **Tailwind CSS (v4):** Cutting-edge utility-first styling for a custom aesthetic.
- **Motion (Framer):** Advanced layout and state-based animations.
- **Lucide React:** A clean and consistent icon library.
- **jspdf & html2canvas:** Client-side PDF generation for tactical reports.

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd flora-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/App.tsx`: The heart of the application containing all routes and core logic.
- `src/index.css`: Custom Tailwind setup and the "Glitch Art" animation engine.
- `public/`: High-resolution botanical assets and specimen imagery.
- `server.ts`: Express backend configuration optimized for Cloud Run.

## 📝 Usage Guide

1. **Exploring:** Use the Gallery to search through the botanical archive.
2. **Archiving:** Use the "Upload" section on the Home page to document a new specimen. (Note: In this Lite version, identification is manual/mocked).
3. **Saving:** Add specimens to your private Garden. They are persisted locally in your browser.
4. **Exporting:** View your saved specimens and click "Export Tactical Data" to save a PDF report.

---

*Built with passion for the botanical world.*
