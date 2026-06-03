# Provit — Study it. Then prove it.

**Live app:** https://provit-ai.quikdb.net   
**Deployed on:** QuikDB Compute

---

## The problem

Most study tools are passive. You read, you summarize, you close the tab — and forget everything by tomorrow.

ChatGPT will summarize your notes. Provit won't let you leave until you actually know them.

---

## What Provit does

Paste any study material or type any topic. Provit builds a structured 5-lesson course and uses the **Feynman technique** to ensure retention — you must explain each lesson back in your own words before the next one unlocks.

**The core loop:**
1. Drop your material or type a topic
2. Read a focused lesson (180–300 words, no fluff)
3. Explain it back in your own words
4. AI scores your explanation (requires 70% to pass)
5. Next lesson unlocks only when you pass
6. Complete all 5 → receive a certificate

---

## Features

- AI-generated 5-lesson courses from any topic or uploaded PDF
- Explain-it-back grading with real-time AI feedback
- Multiple choice and open-ended challenge types
- Progressive lesson unlocking — no skipping
- Anti-cheat paste blocker (active recall enforced)
- Completion certificate with download
- Course history saved locally
- Clean animated landing page with interactive demo

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| AI | OpenRouter API (LLM course generation + evaluation) |
| PDF Parsing | unpdf |
| Hosting | QuikDB Compute |

---

## Architecture highlight

Course generation uses an **async job pattern** to handle LLM latency:

1. POST `/api/course/generate` responds instantly with a `jobId`
2. Frontend polls `/api/course/status/:jobId` every 2 seconds
3. Job resolves when LLM returns — no gateway timeouts

---

## Why 5 lessons?

The Feynman technique works best in focused chunks. 5 deeply understood lessons beat 20 passively skimmed ones. Every lesson in Provit requires proof before progression — that's the core differentiator.

---

## Running locally

```bash
git clone https://github.com/Mikomijie/Provit.git
cd Provit
npm install
```

Create a `.env` file:
```
OPENROUTER_API_KEY=your_key_here
```

```bash
npm run dev
```

Open `http://127.0.0.1:3000`

---

## Author

Built by Mikomijie for the BuildQuik Challenge 2026
