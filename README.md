# GradeAI — Sleek AI-Powered Exam Grader & Evaluator 📝

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-supported-orange.svg)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-supported-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JS](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Gemini API](https://img.shields.io/badge/Gemini%20API-v1.5%20Flash-blueviolet.svg)](https://ai.google.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg)](https://paper-grader-indol.vercel.app)

GradeAI is a premium, high-fidelity browser application that digitizes handwritten student answer sheets using multimodal OCR and automatically grades them using the Google Gemini API based on subject-specific rubrics. Designed for modern classrooms, it provides a dual-pane workspace for real-time review, feedback, annotations, and grade adjustments.

---

## 🚀 Live Demo

You can access the live web deployment here:
**👉 [https://paper-grader-indol.vercel.app](https://paper-grader-indol.vercel.app)**

---

## ✨ Features

- **📂 Dual-Pane Workspace**: Left pane displays the student's paper with canvas-based annotations (correct checks, error crosses, circles, and underlines). Right pane handles grading cards, extracted OCR text, and overall evaluation metrics.
- **🤖 Multimodal AI Grading**: Communicates with `Gemini 1.5 Flash` to extract handwritten content, evaluate calculations or textual essays, and award marks.
- **📐 Subject-Specific Rubrics**:
  - **Math**: Step-by-step logic checking, awarding partial marks for correct steps even if the final calculation has errors.
  - **Science & Social**: Factual keyword matching, concept validation, and vocabulary recommendations.
  - **English & Languages**: Grammar, spelling, coherence, structures, and phrasing evaluations.
- **✏️ Interactive Grade Overrides**: Teachers can adjust scores on the fly with a dynamic range slider and log explanation notes.
- **📊 Class Dashboard Analytics**: Real-time tracking of Average Marks, Pass Rate, and total evaluations, with a history list to edit/delete past entries.
- **🔒 Local API Key Sandbox**: Securely stores API keys in browser `localStorage` to preserve user privacy and keep requests client-side.

---

## 🛠️ Tech Stack

- **Markup**: Semantic HTML5 & Inline SVGs
- **Styles**: Vanilla CSS3 (Custom design system, glowing slider components, glassmorphism, responsive grid layout)
- **Engine**: Client-side JavaScript (ES6 Modules, Canvas API overlay renderer, Gemini REST API integration)

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/shriyanshthanneeru2407-dotcom/GradeAI.git
cd GradeAI
```

### 2. Run the local web server
Start the lightweight development server:
```bash
npm run dev
```
Or use `http-server` directly:
```bash
npx -y http-server -p 3000
```

### 3. Open in Browser
Visit [http://localhost:3000](http://localhost:3000) to run the application locally!

---

## 📂 File Structure

```
paper-grader/
│
├── index.html          # HTML structure, student sheet panels, grading cards, settings
├── styles.css          # Premium design system variables, glassmorphic layout, glowing sliders
├── app.js              # State manager, DOM actions, analytics, history log
├── gemini.js           # Gemini API interface, prompt template builder, JSON schema enforcement
├── mockData.js         # Interactive demo data: pre-graded sheets, coordinates, mock student papers
├── package.json        # Build/dev server script, project keywords
└── .gitignore          # Production build configuration exclusions
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
