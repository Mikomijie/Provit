# Provit — Shipping Plan

## 1. Idea Validation

**Problem:** Students read their notes passively and forget everything. Existing tools like ChatGPT summarize content but never check if you actually understood it.

**One sentence:** Provit forces active recall — you cannot move to the next lesson until you can explain the last one back in your own words.

**Who has this problem:** University students, self-learners, and exam preppers who study for hours but retain very little.

**How people solve it today:** They re-read notes, use ChatGPT to summarize, or make flashcards. None of these verify understanding.

**Validation:** Shared with friends and classmates — immediate reaction was "this is actually useful, I hate that I can just scroll past stuff on other apps."

---

## 2. Target Audience

**Ideal user:** A 300-level university student in Nigeria with an exam in 3 days who has lecture notes but hasn't studied properly.

**Where they hang out:** WhatsApp study groups, Twitter/X, Discord servers, university forums.

**Why they'd switch:** Every other tool lets you lie to yourself. Provit doesn't.

---

## 3. Tech Stack Rationale

- **React + TypeScript** — component-based UI, type safety catches bugs early
- **Express.js** — lightweight REST API, perfect for this scope
- **OpenRouter API** — free LLM access with fallback model routing, no credit card needed
- **Vite** — fast builds, hot reload for development speed
- **QuikDB Compute** — zero-config deployment, free *.quikdb.net URL
- **No database** — localStorage is sufficient for MVP; no auth friction means users start learning in under 30 seconds

**Key tradeoff:** Chose no authentication deliberately. Signup walls kill conversion. The core value is immediate — open, drop notes, learn, prove it.

---

## 4. MVP Scope

| Feature | Status | Priority |
|---|---|---|
| Topic-based course generation | Done | Must have |
| PDF upload support | Done | Must have |
| 5-lesson structure | Done | Must have |
| Explain-it-back grading | Done | Must have |
| Lesson unlocking system | Done | Must have |
| Anti-cheat paste blocker | Done | Must have |
| Completion certificate | Done | Nice to have |
| Course history | Done | Nice to have |
| User authentication | Skipped | v2 |
| Cross-device sync | Skipped | v2 |
| Leaderboards | Skipped | v2 |
| Teacher dashboard | Skipped | v2 |

**v2 vision:** Add user accounts, streaks that sync across devices, and a teacher mode where educators can create courses for their students.

---

## 5. Testing

**Manual testing completed:**
- Course generation from topic input
- Course generation from PDF upload
- Explain-it-back grading (open-ended)
- Multiple choice grading
- Lesson unlocking after passing 70%
- Lesson locked when score below 70%
- Anti-paste blocker in answer box
- Certificate modal on course completion
- Course history persistence across sessions
- Mobile responsiveness

**Edge cases handled:**
- Empty answer submission blocked
- PDF parsing failure falls back to text paste
- AI empty response throws clean error message
- Null content from LLM handled gracefully
- Async job pattern prevents gateway timeouts on slow LLM responses

**Health endpoint:** `https://provit-ai.quikdb.net/api/health`

---

## 6. Deployment and Monitoring

- Deployed on QuikDB Compute — `https://provit-ai.quikdb.net`
- Health endpoint live at `/api/health`
- Environment variables stored in QuikDB encrypted env vars
- No hardcoded secrets in codebase
- Async job pattern implemented to handle LLM latency without gateway timeouts
- Error handling on all API routes with meaningful error messages

---

## 7. Launch Plan

**First 10 users:**
- Shared with university classmates and friends — already getting positive feedback
- Posted on X with #BuildQuik
- Will share in Nigerian developer communities on Discord and WhatsApp
- Demo video being recorded for wider sharing

**After the challenge:**
- Add user accounts and cross-device sync
- Target Nigerian university students during exam season
- Partner with study groups and student communities
- Explore a teacher mode for educators to assign courses

---

## Why Provit can survive after the challenge

The problem is universal and recurring. Every student has exams. Every exam requires retention. Provit sits exactly at the intersection of AI capability and a real human need  and it does one thing better than anything else: it makes sure you actually know what you studied. I actually had to test it with real users and they said it was really valuable to them.