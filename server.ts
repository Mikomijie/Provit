import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

const jobs: Record<string, { status: string; data: any; error: string | null }> = {};

async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  console.log("API KEY EXISTS:", !!key, "LENGTH:", key?.length);
  if (!key) throw new Error("OPENROUTER_API_KEY is not set.");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
      "HTTP-Referer": "https://provit-ai.quikdb.net",
      "X-Title": "Provit"
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.post("/api/course/generate", async (req, res) => {
  const jobId = Date.now().toString();
  jobs[jobId] = { status: "processing", data: null, error: null };

  res.json({ jobId, status: "processing" });

  try {
    const { topic, materialText, difficultyLevel, pdfBase64 } = req.body;
    let finalText = materialText || "";

    if (pdfBase64) {
      try {
        const { extractText } = await import("unpdf");
        const buffer = Buffer.from(pdfBase64, "base64");
        const { text } = await extractText(new Uint8Array(buffer), { mergePages: true });
        finalText = text.substring(0, 8000);
      } catch (pdfErr: any) {
        jobs[jobId] = { status: "error", data: null, error: "Could not read PDF. Please paste text directly." };
        return;
      }
    }

    if (!topic && !finalText.trim()) {
      jobs[jobId] = { status: "error", data: null, error: "Please provide a topic or study material." };
      return;
    }

    const systemPrompt =
      "You are a friendly, genius curriculum designer. Transform any educational request " +
      "into an engaging 5-lesson micro-course. Output ONLY valid JSON, no extra text. " +
      "Structure: { title, difficulty, summary, lessons: [ { id, title, visualIcon, " +
      "shortDescription, content, challengeType, challengePrompt, multipleChoiceOptions, " +
      "correctAnswer, successCriteriaHint } ] }. " +
      "challengeType must be either 'explain_back' or 'multiple_choice'. " +
      "visualIcon must be one of: Brain, Lightbulb, BookOpen, GraduationCap, Code, Globe, Zap, Compass, Flame, Shield, Cpu, Activity, Award, Sparkles, Anchor. " +
      "Content should be 180-300 words in clean Markdown. Make it engaging like Duolingo meets Notion.";

    const userPrompt = `Create a 5-lesson course.
Topic: "${topic || 'Extracted from uploaded material'}"
Material: ${finalText ? `"""${finalText}"""` : "None provided"}
Difficulty: ${difficultyLevel || "General Learner"}
Return exactly 5 lessons in the JSON structure specified.`;

    const raw = await callAI(systemPrompt, userPrompt);
    const courseData = JSON.parse(raw);
    jobs[jobId] = { status: "done", data: courseData, error: null };

  } catch (err: any) {
    console.error("Course Generation Error:", err);
    jobs[jobId] = { status: "error", data: null, error: err.message };
  }
});

app.get("/api/course/status/:jobId", (req, res) => {
  const job = jobs[req.params.jobId];
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

app.post("/api/course/evaluate", async (req, res) => {
  try {
    const { courseTitle, lessonTitle, challengePrompt, userAnswer, challengeType, correctAnswer } = req.body;

    if (!userAnswer || userAnswer.trim().length === 0) {
      return res.status(400).json({ error: "Please enter an answer." });
    }

    const systemPrompt =
      "You are a warm, supportive AI tutor with a Duolingo-style vibe. " +
      "Output ONLY valid JSON, no extra text. " +
      "Structure: { passed: boolean, score: number (0-100), feedback: string, suggestedCorrection: string }. " +
      "passed is true if score >= 70. Be encouraging and constructive.";

    const userPrompt = `Evaluate this student response.
Course: "${courseTitle}"
Lesson: "${lessonTitle}"
Question: "${challengePrompt}"
Student Answer: "${userAnswer}"
Type: "${challengeType}"
${correctAnswer ? `Correct Answer: "${correctAnswer}"` : ""}
Score from 0-100. Return JSON with passed, score, feedback, suggestedCorrection.`;

    const raw = await callAI(systemPrompt, userPrompt);
    const evaluation = JSON.parse(raw);
    return res.json(evaluation);

  } catch (err: any) {
    console.error("Evaluation Error:", err);
    res.status(500).json({ error: err.message || "Failed to evaluate. Please try again." });
  }
});

const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Provit Server running on port ${PORT}`);
});