import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import UploadPage from "./components/UploadPage";
import CourseViewer from "./components/CourseViewer";
import HistoryList from "./components/HistoryList";
import { Course, Lesson, EvaluationResult } from "./types";
import { HelpCircle } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'upload' | 'course' | 'history'>('landing');
  const [uploadInitialMode, setUploadInitialMode] = useState<'topic' | 'material'>('topic');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [unlockedLessonId, setUnlockedLessonId] = useState<number>(1);
  const [activeLessonId, setActiveLessonId] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [courseHistory, setCourseHistory] = useState<{
    [key: string]: { course: Course; unlockedLessonId: number };
  }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("learndrop_courses_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCourseHistory(parsed);
        const keys = Object.keys(parsed);
        if (keys.length > 0) {
          const lastKey = keys[keys.length - 1];
          setActiveCourse(parsed[lastKey].course);
          setUnlockedLessonId(parsed[lastKey].unlockedLessonId);
          setActiveLessonId(parsed[lastKey].unlockedLessonId > 5 ? 5 : parsed[lastKey].unlockedLessonId);
        }
      }
    } catch (err) {
      console.error("Local Storage load failed: ", err);
    }
  }, []);

  const syncHistoryToStorage = (updatedHistory: typeof courseHistory) => {
    setCourseHistory(updatedHistory);
    localStorage.setItem("learndrop_courses_v2", JSON.stringify(updatedHistory));
  };

  const handleGetStarted = (mode: 'topic' | 'material') => {
    setUploadInitialMode(mode);
    setCurrentView('upload');
  };

  const handleGenerateCourse = async (params: {
    topic?: string;
    materialText?: string;
    pdfBase64?: string;
    difficultyLevel: string;
  }) => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      // Step 1 — start the job, server responds instantly
      const response = await fetch("/api/course/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Server error.");
      }

      const { jobId } = await response.json();

      // Step 2 — poll every 2 seconds until done
      const courseData = await new Promise<any>((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            const poll = await fetch(`/api/course/status/${jobId}`);
            const result = await poll.json();

            if (result.status === "done") {
              clearInterval(interval);
              resolve(result.data);
            } else if (result.status === "error") {
              clearInterval(interval);
              reject(new Error(result.error || "Course generation failed."));
            }
            // still "processing" — keep polling
          } catch (pollErr) {
            clearInterval(interval);
            reject(pollErr);
          }
        }, 2000);
      });

      const courseKey = courseData.title || params.topic || "Untitled Course";
      const newHistory = {
        ...courseHistory,
        [courseKey]: { course: courseData, unlockedLessonId: 1 }
      };

      setActiveCourse(courseData);
      setUnlockedLessonId(1);
      setActiveLessonId(1);
      syncHistoryToStorage(newHistory);
      setCurrentView('course');

    } catch (err: any) {
      console.error("Course Generation trigger failed: ", err);
      setErrorMessage(err.message || "Course building failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluateChallenge = async (params: {
    lesson: Lesson;
    userAnswer: string;
  }): Promise<EvaluationResult> => {
    if (!activeCourse) throw new Error("No active course.");

    const payload = {
      courseTitle: activeCourse.title,
      lessonTitle: params.lesson.title,
      challengePrompt: params.lesson.challengePrompt,
      userAnswer: params.userAnswer,
      challengeType: params.lesson.challengeType,
      correctAnswer: params.lesson.correctAnswer,
    };

    const response = await fetch("/api/course/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errJson = await response.json();
      throw new Error(errJson.error || "Evaluation failed.");
    }

    return await response.json();
  };

  const handleSetUnlocks = (nextId: number) => {
    if (!activeCourse) return;
    const courseKey = activeCourse.title;
    setUnlockedLessonId(nextId);
    const updatedHistory = {
      ...courseHistory,
      [courseKey]: { ...courseHistory[courseKey], unlockedLessonId: nextId }
    };
    syncHistoryToStorage(updatedHistory);
  };

  const handleSetActive = (nextId: number) => {
    setActiveLessonId(nextId);
  };

  const handleResumeCourseInLibrary = (key: string) => {
    const target = courseHistory[key];
    if (target) {
      setActiveCourse(target.course);
      setUnlockedLessonId(target.unlockedLessonId);
      setActiveLessonId(target.unlockedLessonId > 5 ? 5 : target.unlockedLessonId);
      setCurrentView('course');
    }
  };

  const handleDeleteCourseInLibrary = (key: string) => {
    const updated = { ...courseHistory };
    delete updated[key];
    syncHistoryToStorage(updated);
    if (activeCourse?.title === key) {
      const keys = Object.keys(updated);
      if (keys.length > 0) {
        const lastKey = keys[keys.length - 1];
        setActiveCourse(updated[lastKey].course);
        setUnlockedLessonId(updated[lastKey].unlockedLessonId);
        setActiveLessonId(updated[lastKey].unlockedLessonId > 5 ? 5 : updated[lastKey].unlockedLessonId);
      } else {
        setActiveCourse(null);
        setUnlockedLessonId(1);
        setActiveLessonId(1);
      }
    }
  };

  const historyCount = Object.keys(courseHistory).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]" id="app-root-container">

      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        hasActiveCourse={activeCourse !== null}
        historyCount={historyCount}
      />

      <main className="flex-grow">

        {errorMessage && (
          <div className="max-w-xl mx-auto mt-6 px-6" id="error-alert">
            <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-red-950 px-5 py-4 rounded-2xl flex items-start space-x-3.5 text-left">
              <span className="p-1 px-2.5 bg-[#FF6B6B]/20 text-[#FF6B6B] rounded-xl font-bold font-mono text-sm shrink-0">!</span>
              <div className="space-y-1">
                <p className="font-extrabold text-sm leading-none">AI Integration Notice</p>
                <p className="text-xs leading-relaxed text-gray-600">{errorMessage}</p>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-xs font-bold text-[#6C47FF] hover:underline mt-1 border-0 bg-transparent inline-block cursor-pointer"
                >
                  Dismiss warning
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={handleGetStarted}
            onNavigate={setCurrentView}
            historyCount={historyCount}
          />
        )}

        {currentView === 'upload' && (
          <UploadPage
            initialMode={uploadInitialMode}
            onGenerate={handleGenerateCourse}
            isGenerating={isGenerating}
          />
        )}

        {currentView === 'course' && activeCourse && (
          <CourseViewer
            course={activeCourse}
            unlockedLessonId={unlockedLessonId}
            activeLessonId={activeLessonId}
            onSetUnlocks={handleSetUnlocks}
            onSetActive={handleSetActive}
            onEvaluateChallenge={handleEvaluateChallenge}
          />
        )}

        {currentView === 'course' && !activeCourse && (
          <div className="text-center py-20 bg-white shadow-xs rounded-3xl max-w-lg mx-auto border border-gray-150 p-8 mt-12 space-y-4">
            <HelpCircle className="h-12 w-12 text-gray-300 mx-auto" strokeWidth="1.5" />
            <h3 className="font-extrabold text-lg text-gray-900 leading-none">No active course selected</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Generate a course first to start learning.
            </p>
            <button
              onClick={() => setCurrentView('upload')}
              className="px-5 py-2.5 bg-[#6C47FF] hover:bg-[#5835E5] text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-transform hover:scale-105"
            >
              Go to Generator
            </button>
          </div>
        )}

        {currentView === 'history' && (
          <HistoryList
            courses={courseHistory}
            onResumeCourse={handleResumeCourseInLibrary}
            onDeleteCourse={handleDeleteCourseInLibrary}
            onNavigateToUpload={() => { setUploadInitialMode('topic'); setCurrentView('upload'); }}
          />
        )}

      </main>
    </div>
  );
}