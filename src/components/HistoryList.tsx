import { Award, BookOpen, Trash2, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { Course } from "../types";

interface HistoryListProps {
  courses: { [key: string]: { course: Course; unlockedLessonId: number } };
  onResumeCourse: (topicKey: string) => void;
  onDeleteCourse: (topicKey: string) => void;
  onNavigateToUpload: () => void;
}

export default function HistoryList({ courses, onResumeCourse, onDeleteCourse, onNavigateToUpload }: HistoryListProps) {
  const courseKeys = Object.keys(courses);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-left" id="history-dashboard-container">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-10">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-gray-950 tracking-tight flex items-center space-x-2.5">
            <BookOpen className="h-6 w-6 text-[#6C47FF]" />
            <span>My Learning Library</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Browse and resume generated 5-lesson curricula
          </p>
        </div>

        <button
          onClick={onNavigateToUpload}
          className="flex items-center space-x-1 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-[#FF6B6B]" />
          <span>New Course</span>
        </button>
      </div>

      {courseKeys.length === 0 ? (
        // Empty State: Invite to build a course
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-xl space-y-6 max-w-lg mx-auto animate-fade-in" id="empty-history">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#6C47FF]/10 flex items-center justify-center p-3 text-[#6C47FF]">
            <BookOpen className="h-full w-full" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-display font-bold text-xl text-gray-900 tracking-tight">
              Your Library is empty
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
              You haven't generated any micro-learning courses yet. Give us a study note file or learning topic to begin!
            </p>
          </div>

          <button
            onClick={onNavigateToUpload}
            className="px-6 py-3 bg-[#6C47FF] hover:bg-[#5835E5] text-white font-bold text-sm rounded-xl tracking-wide shadow-sm transition-all inline-flex items-center space-x-1 cursor-pointer"
          >
            <span>Create My First Course</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        // Library Grid
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="history-grid">
          {courseKeys.map((key) => {
            const entry = courses[key];
            const percent = entry.unlockedLessonId > 5 ? 100 : Math.round(((entry.unlockedLessonId - 1) / 5) * 100);

            return (
              <div 
                key={key}
                className="bg-white border border-gray-100 rounded-3xl p-6.5 shadow-sm hover:shadow-md hover:border-[#6C47FF]/10 transition-all flex flex-col justify-between space-y-5 animate-fade-in"
                id={`history-card-${key.replace(/\s+/g, '-')}`}
              >
                
                {/* Header section (Trophy or Book with Title) */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] font-mono font-bold text-[#FF6B6B] bg-[#FF6B6B]/10 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                      {entry.course.difficulty}
                    </span>
                    
                    <button
                      onClick={() => onDeleteCourse(key)}
                      className="text-gray-300 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
                      title="Delete course plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="font-display font-extrabold text-base text-gray-900 tracking-tight leading-snug">
                    {entry.course.title}
                  </h3>
                  
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {entry.course.summary}
                  </p>
                </div>

                {/* Progress Indicators and action Trigger */}
                <div className="space-y-3.5 pt-3.5 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-400 font-bold">COMPLETION STATUS</span>
                    <span className="text-gray-700 font-bold">{percent}%</span>
                  </div>

                  <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6C47FF] to-[#FF6B6B] transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-gray-400 font-mono italic">
                      {entry.unlockedLessonId > 5 ? "Congrats! Completed." : `Unlocked: Lesson ${entry.unlockedLessonId}/5`}
                    </span>
                    
                    <button
                      onClick={() => onResumeCourse(key)}
                      className="flex items-center space-x-1.5 text-xs font-bold text-[#6C47FF] hover:text-[#5835E5] transition-colors cursor-pointer"
                    >
                      <span>Resume Unit</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
