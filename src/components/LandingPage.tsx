import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface LandingPageProps {
  onGetStarted: (mode: 'topic' | 'material') => void;
  onNavigate: (view: 'landing' | 'upload' | 'course' | 'history') => void;
  historyCount: number;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true);
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg, #fafbff 0%, #f4f0ff 40%, #fff8f6 70%, #fffdf0 100%)"
        }}
      />

      {/* Floating orb 1 — purple top right */}
      <div style={{
        position: "absolute",
        top: "-10%", right: "-5%",
        width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(108,71,255,0.18) 0%, transparent 65%)",
        animation: "orb1 9s ease-in-out infinite",
        filter: "blur(8px)"
      }} />

      {/* Floating orb 2 — amber left middle */}
      <div style={{
        position: "absolute",
        top: "30%", left: "-8%",
        width: 450, height: 450,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 65%)",
        animation: "orb2 11s ease-in-out infinite",
        filter: "blur(6px)"
      }} />

      {/* Floating orb 3 — coral bottom right */}
      <div style={{
        position: "absolute",
        bottom: "5%", right: "10%",
        width: 380, height: 380,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,107,107,0.12) 0%, transparent 65%)",
        animation: "orb3 13s ease-in-out infinite",
        filter: "blur(6px)"
      }} />

      {/* Subtle dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(108,71,255,0.08) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        opacity: 0.6
      }} />

      <style>{`
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 40px) scale(1.06); }
          66% { transform: translate(20px, -25px) scale(0.95); }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(40px, -30px) scale(1.08); }
          70% { transform: translate(-20px, 35px) scale(0.94); }
        }
        @keyframes orb3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          35% { transform: translate(-25px, -40px) scale(1.05); }
          65% { transform: translate(30px, 20px) scale(0.96); }
        }
      `}</style>
    </div>
  );
}

export default function LandingPage({ onGetStarted, onNavigate, historyCount }: LandingPageProps) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const stepsAnim = useInView();
  const demoAnim = useInView();

  function handleAnswer(choice: string) {
    setSelected(choice);
    setAnswered(true);
  }

  return (
    <div className="relative min-h-screen" style={{ fontFamily: "'Sora', sans-serif" }}>
      <AnimatedBackground />

      <div className="max-w-6xl mx-auto px-6 pt-14 pb-28">

        {/* HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[560px]">

          <div className="lg:col-span-6 flex flex-col space-y-7">

            <div
              className="inline-flex items-center gap-2 w-fit bg-white/70 backdrop-blur-sm border border-[#6C47FF]/15 rounded-full px-4 py-1.5"
              style={{ animation: "fadeSlideUp 0.5s ease both" }}
            >
              <span
                className="w-2 h-2 rounded-full bg-emerald-500 inline-block"
                style={{ animation: "livepulse 2s ease-in-out infinite" }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>
                Active learners studying right now
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(44px, 5vw, 62px)",
                fontWeight: 900,
                color: "#0f0f1a",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                animation: "fadeSlideUp 0.6s 0.05s ease both"
              }}
            >
              Study it.<br />
              <span style={{ color: "#6C47FF" }}>Then prove it.</span>
            </h1>

            <p
              style={{
                color: "#6b7280",
                fontSize: 17,
                lineHeight: 1.7,
                maxWidth: 420,
                animation: "fadeSlideUp 0.6s 0.12s ease both"
              }}
            >
              Paste your notes or type any topic. Provit builds a 5-lesson course and won't unlock the next lesson until you can actually explain the last one.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 pt-1"
              style={{ animation: "fadeSlideUp 0.6s 0.2s ease both" }}
            >
              <button
                onClick={() => onGetStarted('material')}
                className="flex items-center justify-center gap-2.5 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all duration-150 active:scale-[0.96]"
                style={{
                  background: "#6C47FF",
                  boxShadow: "0 8px 28px rgba(108,71,255,0.38), inset 0 1px 0 rgba(255,255,255,0.15)",
                  fontWeight: 700,
                  fontSize: 15
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#5835E5")}
                onMouseLeave={e => (e.currentTarget.style.background = "#6C47FF")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload Material
              </button>

              <button
                onClick={() => onGetStarted('topic')}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base transition-all duration-150 active:scale-[0.96]"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "2px solid #e5e7eb",
                  color: "#1f2937",
                  fontWeight: 700,
                  fontSize: 15,
                  backdropFilter: "blur(8px)"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(108,71,255,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.95)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "rgba(255,255,255,0.8)"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Type a Topic
              </button>
            </div>

            {/* Social proof */}
            <div
              className="flex items-center gap-3 pt-1"
              style={{ animation: "fadeSlideUp 0.6s 0.28s ease both" }}
            >
              <div className="flex -space-x-2">
                {[
                  { bg: "#6C47FF", letter: "A" },
                  { bg: "#FF6B6B", letter: "B" },
                  { bg: "#F59E0B", letter: "C" },
                  { bg: "#10B981", letter: "D" },
                ].map((u, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white"
                    style={{ background: u.bg, fontSize: 11, fontWeight: 800 }}
                  >
                    {u.letter}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                <span style={{ color: "#0f0f1a", fontWeight: 800 }}>2,400+ students</span> passed their exams this month
              </p>
            </div>
          </div>

          {/* Hero card */}
          <div
            className="lg:col-span-6 relative flex justify-center items-center"
            style={{ animation: "fadeSlideUp 0.7s 0.1s ease both" }}
          >
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: "radial-gradient(ellipse at center, rgba(108,71,255,0.18) 0%, transparent 70%)",
                filter: "blur(35px)",
                transform: "scale(1.15)"
              }}
            />
            <div
              className="bg-white/80 rounded-3xl p-6 w-full max-w-[390px] relative"
              style={{
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(108,71,255,0.10)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.09), 0 0 0 1px rgba(108,71,255,0.06)"
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#6C47FF" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "#0f0f1a", fontSize: 13 }}>Photosynthesis 101</p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#6C47FF", background: "rgba(108,71,255,0.1)", padding: "2px 8px", borderRadius: 99 }}>LESSON 2 OF 5</span>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: "livepulse 2s infinite" }} />
                  <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}>Live</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full mb-4 overflow-hidden" style={{ background: "#f3f4f6" }}>
                <div className="h-full rounded-full w-[40%]" style={{ background: "linear-gradient(90deg, #6C47FF, #8C6AFF)" }} />
              </div>
              <p style={{ color: "#9ca3af", fontSize: 12, lineHeight: 1.7, marginBottom: 16 }}>
                Chlorophyll absorbs red and blue light, reflecting green. That is why plants appear green to the human eye.
              </p>
              <div className="rounded-2xl p-4" style={{ background: "#FFFBF0", border: "1px solid rgba(255,209,102,0.5)" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 4 }}>Your turn</p>
                <p style={{ fontSize: 11, color: "#9ca3af" }}>Why do plants need sunlight to survive?</p>
              </div>
            </div>

            {/* Badge top right */}
            <div
              className="absolute -top-4 -right-2 flex items-center gap-2.5 bg-white/90 rounded-2xl px-3.5 py-2.5"
              style={{
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                animation: "popIn 0.4s 0.9s ease both"
              }}
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#0f0f1a", lineHeight: 1 }}>Nice work!</p>
                <p style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>92% score -  Lesson 3 unlocked</p>
              </div>
            </div>

            {/* Badge bottom left no emoji here */}
            <div
              className="absolute -bottom-4 -left-4 flex items-center gap-2 bg-white/90 rounded-2xl px-3.5 py-2.5"
              style={{
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                animation: "popIn 0.4s 1.1s ease both"
              }}
            >
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF6B6B, #FF8E53)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 17 18 12 13 7"/>
                  <polyline points="6 17 11 12 6 7"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#0f0f1a", lineHeight: 1 }}>5-day streak</p>
                <p style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>Keep it going</p>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE DEMO */}
        <div
          ref={demoAnim.ref}
          className="mt-32"
          style={{ transition: "opacity 0.7s, transform 0.7s", opacity: demoAnim.inView ? 1 : 0, transform: demoAnim.inView ? "translateY(0)" : "translateY(40px)" }}
        >
          <div className="text-center mb-10">
            <h2 style={{ fontSize: 30, fontWeight: 900, color: "#0f0f1a", marginBottom: 10, letterSpacing: "-0.02em" }}>
              Try one question. Right now.
            </h2>
            <p style={{ color: "#9ca3af", fontSize: 15, maxWidth: 340, margin: "0 auto" }}>
              No signup. This is exactly how Provit works.
            </p>
          </div>

          <div
            className="max-w-xl mx-auto rounded-3xl p-8"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(108,71,255,0.10)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.08)"
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2.5 flex-1 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
                <div className="h-full rounded-full w-[60%]" style={{ background: "linear-gradient(90deg, #6C47FF, #8C6AFF)" }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>3 of 5</span>
            </div>

            <p style={{ color: "#0f0f1a", fontWeight: 700, fontSize: 17, marginBottom: 20, letterSpacing: "-0.01em" }}>
              What gas do plants release during photosynthesis?
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"].map((opt) => {
                const correct = opt === "Oxygen";
                let bg = "rgba(255,255,255,0.9)";
                let border = "2px solid #e5e7eb";
                let color = "#374151";
                if (answered && selected === opt && correct) { bg = "#f0fdf4"; border = "2px solid #22c55e"; color = "#15803d"; }
                else if (answered && selected === opt && !correct) { bg = "#fef2f2"; border = "2px solid #f87171"; color = "#dc2626"; }
                else if (answered && correct) { bg = "#f0fdf4"; border = "2px solid #22c55e"; color = "#15803d"; }
                return (
                  <button
                    key={opt}
                    onClick={() => !answered && handleAnswer(opt)}
                    className="rounded-2xl px-4 py-4 text-sm text-left transition-all duration-200"
                    style={{
                      background: bg, border, color,
                      fontWeight: 700, fontSize: 13,
                      cursor: !answered ? "pointer" : "default",
                      backdropFilter: "blur(8px)"
                    }}
                  >
                    {answered && selected === opt && correct && "✓ "}
                    {answered && selected === opt && !correct && "✗ "}
                    {opt}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div
                className="rounded-2xl p-4 mt-2"
                style={{
                  background: selected === "Oxygen" ? "#f0fdf4" : "#fef2f2",
                  border: selected === "Oxygen" ? "1px solid #bbf7d0" : "1px solid #fecaca",
                  animation: "popIn 0.3s ease both"
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 700, color: selected === "Oxygen" ? "#15803d" : "#dc2626" }}>
                  {selected === "Oxygen"
                    ? "Correct! Plants release oxygen as a byproduct of photosynthesis."
                    : "Not quite. Plants release oxygen, not " + selected + "."}
                </p>
                <button
                  onClick={() => onGetStarted('topic')}
                  className="mt-3 flex items-center gap-1 hover:underline"
                  style={{ fontSize: 12, fontWeight: 700, color: "#6C47FF" }}
                >
                  Build a full course like this
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div ref={stepsAnim.ref} className="mt-32 text-center">
          <h2 style={{ fontSize: 30, fontWeight: 900, color: "#0f0f1a", marginBottom: 10, letterSpacing: "-0.02em" }}>
            How it works
          </h2>
          <p style={{ color: "#9ca3af", fontSize: 15, maxWidth: 400, margin: "0 auto 56px" }}>
            No account. No setup. Drop your material and you are learning in under 30 seconds.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left max-w-5xl mx-auto">
            {[
              {
                num: "01", color: "#6C47FF",
                bg: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(244,241,255,0.95) 100%)",
                border: "rgba(108,71,255,0.12)",
                label: "Drop it",
                desc: "Paste your lecture notes, upload a PDF, or just type any topic you want to learn.",
                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              },
              {
                num: "02", color: "#FF6B6B",
                bg: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,245,245,0.95) 100%)",
                border: "rgba(255,107,107,0.12)",
                label: "Learn it",
                desc: "Provit structures your material into 5 focused lessons. No filler. No fluff.",
                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              },
              {
                num: "03", color: "#F59E0B",
                bg: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,251,240,0.95) 100%)",
                border: "rgba(245,158,11,0.12)",
                label: "Prove it",
                desc: "Explain the lesson back in your own words. AI grades you. Next lesson unlocks only when you pass.",
                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              }
            ].map((s, i) => (
              <div
                key={s.label}
                className="rounded-3xl p-7 relative overflow-hidden hover:scale-[1.025] transition-transform duration-300"
                style={{
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                  opacity: stepsAnim.inView ? 1 : 0,
                  transform: stepsAnim.inView ? "translateY(0)" : "translateY(30px)",
                  transition: `opacity 0.55s ${i * 0.13}s ease, transform 0.55s ${i * 0.13}s ease`
                }}
              >
                <span
                  className="absolute top-4 right-5 select-none"
                  style={{ fontSize: 60, fontWeight: 900, color: s.color, opacity: 0.07, lineHeight: 1 }}
                >
                  {s.num}
                </span>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5" style={{ background: s.color }}>
                  {s.svg}
                </div>
                <h3 style={{ fontWeight: 900, color: "#0f0f1a", fontSize: 20, marginBottom: 8, letterSpacing: "-0.01em" }}>{s.label}</h3>
                <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <div
            className="inline-block rounded-3xl px-10 py-10 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(244,241,255,0.95) 0%, rgba(237,232,255,0.9) 60%, rgba(255,245,245,0.9) 100%)",
              border: "1px solid rgba(108,71,255,0.12)",
              backdropFilter: "blur(16px)"
            }}
          >
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0f0f1a", marginBottom: 10, letterSpacing: "-0.02em" }}>
              Ready to actually remember what you study?
            </h2>
            <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 24, maxWidth: 340, margin: "0 auto 24px" }}>
              Thousands of students use Provit to turn notes into real knowledge.
            </p>
            <button
              onClick={() => onGetStarted('material')}
              className="text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-150 active:scale-[0.97]"
              style={{
                background: "#6C47FF",
                fontWeight: 700, fontSize: 15,
                boxShadow: "0 8px 28px rgba(108,71,255,0.38)"
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#5835E5")}
              onMouseLeave={e => (e.currentTarget.style.background = "#6C47FF")}
            >
              Start for free
            </button>
          </div>
        </div>

        {historyCount > 0 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('history')}
              className="inline-flex items-center gap-2 bg-white/70 hover:bg-white px-5 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-700 text-sm transition-all"
              style={{ backdropFilter: "blur(8px)" }}
            >
              Back to your {historyCount} saved courses
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <footer className="border-t py-10" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png.png" alt="Provit" className="w-6 h-6 rounded-lg object-contain" />
            <span style={{ fontWeight: 800, color: "#0f0f1a", fontSize: 14 }}>Provit</span>
            <span style={{ color: "#d1d5db", margin: "0 4px" }}>·</span>
            <span style={{ color: "#9ca3af", fontSize: 13 }}>Built for real students</span>
          </div>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map(t => (
              <span key={t} className="cursor-pointer hover:text-gray-600 transition-colors" style={{ color: "#9ca3af", fontSize: 13 }}>{t}</span>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.82); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes livepulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}