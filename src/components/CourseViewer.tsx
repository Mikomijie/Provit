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

export default function CourseViewer({
  course,
  unlockedLessonId,
  activeLessonId,
  onSetUnlocks,
  onSetActive,
  onEvaluateChallenge,
}: CourseViewerProps) {
  
  const currentLesson = course.lessons.find((l) => l.id === activeLessonId) || course.lessons[0];
  
  // Quiz variables
  const [userExplanation, setUserExplanation] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Sound play / visual alerts triggering
  const [shakeQuiz, setShakeQuiz] = useState(false);

  // Dynamic Lucide icon lookup helper
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
    
    // Validate answer fields
    let finalAnswer = "";
    if (currentLesson.challengeType === "multiple_choice") {
      if (!selectedOption) {
        alert("Please choose an option to check.");
        return;
      }
      finalAnswer = selectedOption;
    } else {
      if (!userExplanation.trim()) {
        alert("Please write a short explanation to prove your understanding.");
        return;
      }
      finalAnswer = userExplanation;
    }

    setIsSubmitting(true);
    try {
      const outcome = await onEvaluateChallenge({
        lesson: currentLesson,
        userAnswer: finalAnswer,
      });

      setEvaluation(outcome);
      if (!outcome.passed) {
        setShakeQuiz(true);
        setTimeout(() => setShakeQuiz(false), 500);
      }
    } catch (err) {
      alert("Error evaluating response. Please verify connection and retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToNextLesson = () => {
    const nextId = currentLesson.id + 1;
    if (nextId <= 5) {
      // Unlock next
      if (nextId > unlockedLessonId) {
        onSetUnlocks(nextId);
      }
      // Switch active focus
      onSetActive(nextId);
      resetQuizState();
    } else {
      // Complete Course celebration!
      onSetUnlocks(6); // 6 signifies completed course
      resetQuizState();
    }
  };

  // Lesson Pathway Indicator Checklist
  return (
    <div className="max-w-6xl mx-auto px-4 py-8" id="course-viewer-container">
      
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
          <p className="text-gray-500 text-sm italic">
            {course.summary}
          </p>
        </div>

        {/* Quick progression block */}
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
        
        {/* LEFT COLUMN: The Duolingo-style sequential Lesson Roadmap */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-display font-semibold text-lg text-gray-950 flex items-center space-x-2">
            <Icons.Compass className="h-5 w-5 text-[#6C47FF]" />
            <span>Path Outline</span>
          </h3>

          <div className="relative pl-7 space-y-6">
            
            {/* Visual background connecting timeline spine */}
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
                    isActive 
                      ? 'bg-[#6C47FF]/5 border border-[#6C47FF]/25 shadow-sm ring-1 ring-[#6C47FF]/5' 
                      : isUnlocked 
                        ? 'hover:bg-gray-50/80 border border-transparent' 
                        : 'opacity-50 cursor-not-allowed border border-transparent'
                  }`}
                  id={`lesson-selector-${les.id}`}
                >
                  
                  {/* Circle Indicator on vertical spine */}
                  <div className={`absolute left-[-26px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full border-3 flex items-center justify-center transition-all ${
                    isCompleted 
                      ? "bg-emerald-500 border-white ring-2 ring-emerald-200" 
                      : isActive 
                        ? "bg-white border-[#6C47FF] ring-2 ring-[#6C47FF]/20" 
                        : isUnlocked 
                          ? "bg-white border-gray-300"
                          : "bg-gray-100 border-gray-200"
                  }`}>
                    {isCompleted && <Icons.Check className="h-2.5 w-2.5 text-white stroke-[4]" />}
                  </div>

                  {/* Icon Block */}
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isCompleted 
                      ? "bg-emerald-50 text-emerald-600" 
                      : isActive 
                        ? "bg-[#6C47FF] text-white" 
                        : "bg-gray-100 text-gray-500"
                  }`}>
                    {renderLucideIcon(les.visualIcon, "h-4.5 w-4.5")}
                  </div>

                  {/* Meta text block */}
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[9px] font-mono font-bold text-gray-400 block tracking-wider uppercase">
                      LESSON {les.id}
                    </span>
                    <h4 className="font-semibold text-xs text-gray-800 leading-snug truncate">
                      {les.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                      {les.shortDescription}
                    </p>
                  </div>

                </button>
              );
            })}

            {/* Completion Flag marker */}
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
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center mt-6 animate-fade-in text-emerald-900 space-y-1.5">
              <div className="flex justify-center"><Icons.PartyPopper className="h-6 w-6 text-emerald-600" /></div>
              <h4 className="font-bold text-sm">Course Conquered!</h4>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Incredible! You have demonstrated proof of understanding on all 5 units. Feel free to download, review, or type a new topic in the generator dashboard anytime!
              </p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Active Lesson Study & Interactive Quiz Board */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Unit Description card */}
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

              <div className="text-xs text-gray-400 font-mono hidden sm:block">
                ~2 min study read
              </div>
            </div>

            {/* Full Markdown content parse */}
            <div className="prose prose-sm max-w-none text-gray-700">
              <MarkdownRenderer content={currentLesson.content} />
            </div>

          </div>

          {/* ACTIVE QUIZ / CHALLENGE BOARD */}
          <div 
            className={`bg-white rounded-3xl border shadow-md transition-all duration-300 ${
              evaluation?.passed 
                ? "border-emerald-200 shadow-emerald-500/5 bg-emerald-50/10" 
                : evaluation 
                  ? "border-coral-200 shadow-coral-500/5 bg-red-50/5" 
                  : "border-gray-150"
            } ${shakeQuiz ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
            id="challenge-board"
          >
            
            {/* Header section representing interactive Duolingo challenge */}
            <div className="p-6 border-b border-gray-150 text-left bg-gray-50/80 rounded-t-3xl flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-tr from-[#FF6B6B] to-yellow-500 text-white rounded-xl shadow-xs">
                <Icons.GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-500 block uppercase tracking-wider">
                  PROOF OF UNDERSTANDING CHALLENGE
                </span>
                <h3 className="font-display font-bold text-base text-gray-900 tracking-tight">
                  Prove it to unlock the next lesson
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 text-left space-y-6">
              
              <div className="space-y-1">
                <p className="text-xs text-[#FF6B6B] font-mono leading-none tracking-wider font-extrabold uppercase">
                  {currentLesson.challengeType === 'multiple_choice' ? 'CONCEPT CHECK' : 'EXPLAIN IT BACK'}
                </p>
                <p className="font-medium text-gray-800 text-[15px] leading-relaxed">
                  {currentLesson.challengePrompt}
                </p>
              </div>

              {/* ACTIVE GRADE EVALUATION OUTPUT PANEL */}
              {evaluation && (
                <div className={`p-5 rounded-2xl border flex items-start space-x-3.5 animate-fade-in ${
                  evaluation.passed 
                    ? "bg-emerald-500/10 border-emerald-200 text-emerald-950" 
                    : "bg-amber-500/10 border-amber-200 text-amber-950"
                }`}>
                  <div className="shrink-0 pt-0.5">
                    {evaluation.passed ? (
                      <Icons.CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                    ) : (
                      <Icons.XCircle className="h-6 w-6 text-[#FF6B6B] shrink-0" />
                    )}
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

                    <p className="font-sans text-[13px] text-gray-600">
                      {evaluation.feedback}
                    </p>

                    {evaluation.suggestedCorrection && (
                      <div className="bg-white/70 p-4 border border-gray-150/60 rounded-xl mt-3.5 space-y-1">
                        <span className="text-[9px] font-mono font-bold uppercase text-gray-600 tracking-wider">TUTOR CORRECTION / INSIGHT</span>
                        <p className="text-xs leading-relaxed text-gray-600 italic">
                          {evaluation.suggestedCorrection}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submitting Response Interface Form */}
              {!evaluation && (
                <form onSubmit={handleQuizSubmit} className="space-y-4">
                  
                  {currentLesson.challengeType === "multiple_choice" ? (
                    // OPTION A: Multiple Choice clickable list
                    <div className="grid grid-cols-1 gap-3">
                      {currentLesson.multipleChoiceOptions?.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setSelectedOption(opt)}
                          className={`p-4 rounded-2xl border text-sm text-left leading-relaxed font-medium transition-all flex items-center space-x-3 ${
                            selectedOption === opt
                              ? "border-[#6C47FF] bg-[#6C47FF]/5 text-[#6C47FF] shadow-xs"
                              : "border-gray-200/90 text-gray-700 hover:border-gray-300 hover:bg-gray-50/50"
                          }`}
                        >
                          <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedOption === opt ? "border-[#6C47FF]" : "border-gray-200"
                          }`}>
                            {selectedOption === opt && <span className="h-2.5 w-2.5 rounded-full bg-[#6C47FF]" />}
                          </span>
                          <span>{opt}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    // OPTION B: Open-ended write back text field
                    <div className="space-y-2">
                      <textarea
                        rows={3.5}
                        value={userExplanation}
                        onChange={(e) => setUserExplanation(e.target.value)}
                        placeholder="Explain key concepts clearly in your own words. Standard explanations mentioned in the lesson block will unlock immediately!"
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
                      <>
                        <Icons.Compass className="h-5 w-5 animate-spin text-white" />
                        <span>Evaluating submission...</span>
                      </>
                    ) : (
                      <>
                        <Icons.CheckCircle2 className="h-5 w-5" />
                        <span>Check Answer</span>
                      </>
                    )}
                  </button>

                </form>
              )}

              {/* PASSING ACTIONS / GRADED CONTINUE POPUP */}
              {evaluation && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
                  {evaluation.passed ? (
                    <button
                      type="button"
                      onClick={handleProceedToNextLesson}
                      className="w-full py-4 bg-[#6C47FF] hover:bg-[#5835E5] text-white rounded-2xl font-bold tracking-wide transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer text-center"
                    >
                      <span>
                        {currentLesson.id === 5 ? "Celebrate and Finish Course!" : "Unlocked! Continue to next chapter →"}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={resetQuizState}
                      className="w-full py-3.5 bg-white text-gray-800 border-2 border-gray-200 hover:bg-gray-50 rounded-2xl font-bold tracking-wide transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center"
                    >
                      <Icons.RefreshCw className="h-4.5 w-4.5" />
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
