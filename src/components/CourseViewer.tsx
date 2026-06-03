import React, { useState } from "react";
import { Lesson, Course, EvaluationResult } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";
import * as Icons from "lucide-react";

interface CourseViewerProps {
  course: Course;
  unlockedLessonId: number;
  activeLessonId: number;
  onSetUnlocks: (id: number) => void;
  onSetActive: (id: number) => void;
  onEvaluateChallenge: (params: {
    lesson: Lesson;
    userAnswer: string;
  }) => Promise<EvaluationResult>;
}

function CertificateModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const handlePrint = () => {
    const printContent = document.getElementById("certificate-content");
    if (!printContent) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Provit Certificate — ${course.title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Georgia, serif; background: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            .cert { width: 800px; padding: 60px; border: 3px solid #6C47FF; border-radius: 16px; text-align: center; position: relative; }
            .cert-inner { border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; }
            .logo { width: 48px; height: 48px; background: #6C47FF; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
            .brand { font-size: 24px; font-weight: 900; color: #6C47FF; font-family: Arial, sans-serif; }
            .subtitle { font-size: 13px; color: #9ca3af; margin-top: 4px; font-family: Arial, sans-serif; }
            .divider { width: 60px; height: 3px; background: #6C47FF; margin: 24px auto; border-radius: 2px; }
            .certifies { font-size: 14px; color: #6b7280; font-family: Arial, sans-serif; }
            .completion { font-size: 36px; font-weight: bold; color: #0f0f1a; margin: 12px 0; }
            .course-title { font-size: 22px; color: #6C47FF; font-weight: bold; font-family: Arial, sans-serif; margin: 8px 0 24px; }
            .desc { font-size: 13px; color: #6b7280; max-width: 500px; margin: 0 auto 32px; line-height: 1.6; font-family: Arial, sans-serif; }
            .footer { display: flex; justify-content: space-between; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
            .footer-item { text-align: center; font-family: Arial, sans-serif; }
            .footer-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
            .footer-value { font-size: 14px; font-weight: bold; color: #0f0f1a; margin-top: 4px; }
          </style>
        </head>
        <body>
          <div class="cert">
            <div class="cert-inner">
              <div class="brand">Provit</div>
              <div class="subtitle">Study it. Then prove it.</div>
              <div class="divider"></div>
              <div class="certifies">This certifies that the learner has successfully completed</div>
              <div class="completion">Certificate of Completion</div>
              <div class="course-title">${course.title}</div>
              <div class="desc">All 5 lessons were studied and each proof-of-understanding challenge was passed with a score of 70% or above using the Feynman technique.</div>
              <div class="footer">
                <div class="footer-item">
                  <div class="footer-label">Difficulty</div>
                  <div class="footer-value">${course.difficulty}</div>
                </div>
                <div class="footer-item">
                  <div class="footer-label">Lessons Completed</div>
                  <div class="footer-value">5 of 5</div>
                </div>
                <div class="footer-item">
                  <div class="footer-label">Date Issued</div>
                  <div class="footer-value">${date}</div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden" id="certificate-content">
        
        {/* Certificate header */}
        <div className="bg-gradient-to-br from-[#6C47FF] to-[#8C6AFF] p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
            <Icons.Award className="h-8 w-8 text-white" />
          </div>
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-1 relative z-10">Certificate of Completion</p>
          <h2 className="text-2xl font-black tracking-tight relative z-10">Course Conquered!</h2>
        </div>

        {/* Certificate body */}
        <div className="p-8 text-center space-y-4">
          <p className="text-gray-500 text-sm">Successfully completed all 5 lessons and passed every proof-of-understanding challenge in</p>
          <h3 className="text-xl font-black text-gray-950 leading-tight">{course.title}</h3>
          
          <div className="flex items-center justify-center gap-6 py-4 border-y border-gray-100 my-4">
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Difficulty</p>
              <p className="text-sm font-bold text-gray-900 mt-1">{course.difficulty}</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Lessons</p>
              <p className="text-sm font-bold text-gray-900 mt-1">5 of 5</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Date</p>
              <p className="text-sm font-bold text-gray-900 mt-1">{date}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[#6C47FF]">
            <div className="w-6 h-6 rounded-lg bg-[#6C47FF] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-black text-sm">Provit</span>
            <span className="text-gray-400 text-xs">· Study it. Then prove it.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3.5 bg-[#6C47FF] hover:bg-[#5835E5] text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Icons.Download className="h-4 w-4" />
            Download Certificate
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CourseViewer({
  course,
  unlockedLessonId,
  activeLessonId,
  onSetUnlocks,
  onSetActive,
  onEvaluateChallenge,
}: CourseViewerProps) {
  
  const currentLesson = course.lessons.find((l) => l.id === activeLessonId) || course.lessons[0];
  const [userExplanation, setUserExplanation] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [shakeQuiz, setShakeQuiz] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const renderLucideIcon = (iconName: string, className: string = "h-5 w-5") => {
    const IconComponent = (Icons as any)[iconName] || Icons.BookOpen;
    return <IconComponent className={className} />;
  };

  const resetQuizState = () => {
    setUserExplanation("");
    setSelectedOption("");
    setEvaluation(null);
  };

  const handleLessonSwitch = (id: number) => {
    if (id <= unlockedLessonId) {
      onSetActive(id);
      resetQuizState();
    }
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalAnswer = "";
    if (currentLesson.challengeType === "multiple_choice") {
      if (!selectedOption) { alert("Please choose an option to check."); return; }
      finalAnswer = selectedOption;
    } else {
      if (!userExplanation.trim()) { alert("Please write a short explanation to prove your understanding."); return; }
      finalAnswer = userExplanation;
    }
    setIsSubmitting(true);
    try {
      const outcome = await onEvaluateChallenge({ lesson: currentLesson, userAnswer: finalAnswer });
      setEvaluation(outcome);
      if (!outcome.passed) { setShakeQuiz(true); setTimeout(() => setShakeQuiz(false), 500); }
    } catch (err) {
      alert("Error evaluating response. Please verify connection and retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToNextLesson = () => {
    const nextId = currentLesson.id + 1;
    if (nextId <= 5) {
      if (nextId > unlockedLessonId) onSetUnlocks(nextId);
      onSetActive(nextId);
      resetQuizState();
    } else {
      onSetUnlocks(6);
      resetQuizState();
      setShowCertificate(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8" id="course-viewer-container">

      {showCertificate && (
        <CertificateModal course={course} onClose={() => setShowCertificate(false)} />
      )}

      {/* Course Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#6C47FF]/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="text-left space-y-1.5 max-w-2xl">
          <span className="text-[10px] font-mono font-bold text-[#6C47FF] bg-[#6C47FF]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Active Module: {course.difficulty}
          </span>
          <h1 className="font-display font-black text-2xl md:text-3xl text-gray-950 tracking-tight leading-tight">
            {course.title}
          </h1>
          <p className="text-gray-500 text-sm italic">{course.summary}</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0 bg-gray-50 p-3 rounded-2xl border border-gray-100/90">
          <Icons.Trophy className="h-5 w-5 text-yellow-500 shrink-0" />
          <div className="text-left leading-none font-semibold">
            <span className="text-[10px] text-gray-400 block tracking-wide font-bold">COURSE PROGRESS</span>
            <span className="text-sm font-mono text-gray-800">
              {unlockedLessonId > 5 ? "100% Completed!" : `${Math.round(((unlockedLessonId - 1) / 5) * 100)}% Complete`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-display font-semibold text-lg text-gray-950 flex items-center space-x-2">
            <Icons.Compass className="h-5 w-5 text-[#6C47FF]" />
            <span>Path Outline</span>
          </h3>

          <div className="relative pl-7 space-y-6">
            <div className="absolute top-4 bottom-4 left-[15px] w-0.5 bg-gray-100"></div>

            {course.lessons.map((les) => {
              const isUnlocked = les.id <= unlockedLessonId;
              const isActive = les.id === activeLessonId;
              const isCompleted = les.id < unlockedLessonId;
              return (
                <button
                  key={les.id}
                  onClick={() => handleLessonSwitch(les.id)}
                  disabled={!isUnlocked}
                  className={`w-full relative flex items-start space-x-3 text-left p-3.5 rounded-2xl transition-all cursor-pointer ${
                    isActive ? 'bg-[#6C47FF]/5 border border-[#6C47FF]/25 shadow-sm ring-1 ring-[#6C47FF]/5' 
                    : isUnlocked ? 'hover:bg-gray-50/80 border border-transparent' 
                    : 'opacity-50 cursor-not-allowed border border-transparent'
                  }`}
                >
                  <div className={`absolute left-[-26px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full border-3 flex items-center justify-center transition-all ${
                    isCompleted ? "bg-emerald-500 border-white ring-2 ring-emerald-200" 
                    : isActive ? "bg-white border-[#6C47FF] ring-2 ring-[#6C47FF]/20" 
                    : isUnlocked ? "bg-white border-gray-300" : "bg-gray-100 border-gray-200"
                  }`}>
                    {isCompleted && <Icons.Check className="h-2.5 w-2.5 text-white stroke-[4]" />}
                  </div>
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isCompleted ? "bg-emerald-50 text-emerald-600" 
                    : isActive ? "bg-[#6C47FF] text-white" 
                    : "bg-gray-100 text-gray-500"
                  }`}>
                    {renderLucideIcon(les.visualIcon, "h-4.5 w-4.5")}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[9px] font-mono font-bold text-gray-400 block tracking-wider uppercase">LESSON {les.id}</span>
                    <h4 className="font-semibold text-xs text-gray-800 leading-snug truncate">{les.title}</h4>
                    <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{les.shortDescription}</p>
                  </div>
                </button>
              );
            })}

            <div className="relative flex items-center space-x-3 pt-2">
              <div className={`absolute left-[-25px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] rounded-md flex items-center justify-center border-2 ${
                unlockedLessonId > 5 ? "bg-[#FF6B6B] border-white ring-2 ring-[#FF6B6B]/20" : "bg-gray-100 border-gray-300"
              }`}>
                {unlockedLessonId > 5 && <Icons.Star className="h-2.5 w-2.5 text-white fill-white" />}
              </div>
              <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <Icons.Award className={`h-4.5 w-4.5 ${unlockedLessonId > 5 ? "text-[#FF6B6B]" : "text-gray-400"}`} />
              </div>
              <div className="text-left font-semibold">
                <span className="text-[9px] font-mono font-bold text-gray-400 block">GOAL FLAG</span>
                <span className="text-xs text-gray-600">Finish lesson challenges!</span>
              </div>
            </div>
          </div>

          {unlockedLessonId > 5 && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center mt-6 text-emerald-900 space-y-3">
              <div className="flex justify-center"><Icons.PartyPopper className="h-6 w-6 text-emerald-600" /></div>
              <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                All 5 lessons completed! Your certificate is ready.
              </p>
              <button
                onClick={() => setShowCertificate(true)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Icons.Award className="h-4 w-4" />
                View Certificate
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-left relative animate-fade-in" id="active-lesson-card">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-[#6C47FF]/10 text-[#6C47FF] p-2.5 rounded-2xl">
                  {renderLucideIcon(currentLesson.visualIcon, "h-5 w-5")}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-extrabold text-[#6C47FF] block uppercase tracking-wider">
                    LESSON {currentLesson.id} OF 5
                  </span>
                  <h2 className="font-display font-bold text-xl text-gray-950 tracking-tight leading-none">
                    {currentLesson.title}
                  </h2>
                </div>
              </div>
              <div className="text-xs text-gray-400 font-mono hidden sm:block">~2 min study read</div>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              <MarkdownRenderer content={currentLesson.content} />
            </div>
          </div>

          <div
            className={`bg-white rounded-3xl border shadow-md transition-all duration-300 ${
              evaluation?.passed ? "border-emerald-200 shadow-emerald-500/5 bg-emerald-50/10" 
              : evaluation ? "border-coral-200 shadow-coral-500/5 bg-red-50/5" 
              : "border-gray-150"
            } ${shakeQuiz ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
          >
            <div className="p-6 border-b border-gray-150 text-left bg-gray-50/80 rounded-t-3xl flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-tr from-[#FF6B6B] to-yellow-500 text-white rounded-xl shadow-xs">
                <Icons.GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-500 block uppercase tracking-wider">PROOF OF UNDERSTANDING CHALLENGE</span>
                <h3 className="font-display font-bold text-base text-gray-900 tracking-tight">Prove it to unlock the next lesson</h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 text-left space-y-6">
              <div className="space-y-1">
                <p className="text-xs text-[#FF6B6B] font-mono leading-none tracking-wider font-extrabold uppercase">
                  {currentLesson.challengeType === 'multiple_choice' ? 'CONCEPT CHECK' : 'EXPLAIN IT BACK'}
                </p>
                <p className="font-medium text-gray-800 text-[15px] leading-relaxed">{currentLesson.challengePrompt}</p>
              </div>

              {evaluation && (
                <div className={`p-5 rounded-2xl border flex items-start space-x-3.5 animate-fade-in ${
                  evaluation.passed ? "bg-emerald-500/10 border-emerald-200 text-emerald-950" 
                  : "bg-amber-500/10 border-amber-200 text-amber-950"
                }`}>
                  <div className="shrink-0 pt-0.5">
                    {evaluation.passed ? <Icons.CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" /> : <Icons.XCircle className="h-6 w-6 text-[#FF6B6B] shrink-0" />}
                  </div>
                  <div className="space-y-2 text-sm leading-relaxed text-left">
                    <div>
                      <p className="font-black text-sm">
                        {evaluation.passed ? "Incredible comprehension! Lesson Conquered!" : "So close! Don't worry, let's learn this together."}
                      </p>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                        Accuracy score: {evaluation.score}% (Requires 70% to pass)
                      </span>
                    </div>
                    <p className="font-sans text-[13px] text-gray-600">{evaluation.feedback}</p>
                    {evaluation.suggestedCorrection && (
                      <div className="bg-white/70 p-4 border border-gray-150/60 rounded-xl mt-3.5 space-y-1">
                        <span className="text-[9px] font-mono font-bold uppercase text-gray-600 tracking-wider">TUTOR CORRECTION / INSIGHT</span>
                        <p className="text-xs leading-relaxed text-gray-600 italic">{evaluation.suggestedCorrection}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!evaluation && (
                <form onSubmit={handleQuizSubmit} className="space-y-4">
                  {currentLesson.challengeType === "multiple_choice" ? (
                    <div className="grid grid-cols-1 gap-3">
                      {currentLesson.multipleChoiceOptions?.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setSelectedOption(opt)}
                          className={`p-4 rounded-2xl border text-sm text-left leading-relaxed font-medium transition-all flex items-center space-x-3 ${
                            selectedOption === opt ? "border-[#6C47FF] bg-[#6C47FF]/5 text-[#6C47FF] shadow-xs" 
                            : "border-gray-200/90 text-gray-700 hover:border-gray-300 hover:bg-gray-50/50"
                          }`}
                        >
                          <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedOption === opt ? "border-[#6C47FF]" : "border-gray-200"}`}>
                            {selectedOption === opt && <span className="h-2.5 w-2.5 rounded-full bg-[#6C47FF]" />}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        rows={4}
                        value={userExplanation}
                        onChange={(e) => setUserExplanation(e.target.value)}
                        onPaste={(e) => {
                          e.preventDefault();
                          alert("Provit requires active recall! Please type your answer in your own words.");
                        }}
                        placeholder="Explain key concepts clearly in your own words."
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/20 focus:border-[#6C47FF] transition-all"
                        required
                      />
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono px-1">
                        <span>Min 1-2 sentence suggested</span>
                        <span>Success criteria: {currentLesson.successCriteriaHint}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gray-950 hover:bg-gray-900 disabled:bg-gray-300 text-white rounded-2xl font-bold tracking-wide transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <><Icons.Compass className="h-5 w-5 animate-spin text-white" /><span>Evaluating submission...</span></>
                    ) : (
                      <><Icons.CheckCircle2 className="h-5 w-5" /><span>Check Answer</span></>
                    )}
                  </button>
                </form>
              )}

              {evaluation && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
                  {evaluation.passed ? (
                    <button
                      type="button"
                      onClick={handleProceedToNextLesson}
                      className="w-full py-4 bg-[#6C47FF] hover:bg-[#5835E5] text-white rounded-2xl font-bold tracking-wide transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>{currentLesson.id === 5 ? "Celebrate and Finish Course!" : "Unlocked! Continue to next chapter →"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={resetQuizState}
                      className="w-full py-3.5 bg-white text-gray-800 border-2 border-gray-200 hover:bg-gray-50 rounded-2xl font-bold tracking-wide transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Icons.RefreshCw className="h-4 w-4" />
                      <span>Adjust answer text and try evaluation again</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}