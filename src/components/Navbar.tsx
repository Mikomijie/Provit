import { History, Award, Plus } from "lucide-react";

interface NavbarProps {
  currentView: 'landing' | 'upload' | 'course' | 'history';
  onNavigate: (view: 'landing' | 'upload' | 'course' | 'history') => void;
  hasActiveCourse: boolean;
  historyCount: number;
}

export default function Navbar({ currentView, onNavigate, hasActiveCourse, historyCount }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-3.5 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Brand — logo image + Provit name, no subtitle */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 group cursor-pointer"
          id="nav-logo-btn"
        >
          <img
            src="/logo.png.png"
            alt="Provit logo"
            className="w-9 h-9 rounded-xl object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-black text-xl text-gray-900 tracking-tight">
            Provit
          </span>
        </button>

        {/* Nav actions */}
        <div className="flex items-center gap-2 md:gap-3">

          {historyCount > 0 && (
            <button
              onClick={() => onNavigate('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === 'history'
                  ? 'bg-gray-100 text-gray-900 border border-gray-200'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
              id="nav-history-btn"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">My Courses</span>
              <span className="bg-[#6C47FF]/10 text-[#6C47FF] px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                {historyCount}
              </span>
            </button>
          )}

          {hasActiveCourse && (
            <button
              onClick={() => onNavigate('course')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === 'course'
                  ? 'bg-[#6C47FF]/10 text-[#6C47FF]'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
              id="nav-resume-btn"
            >
              <Award className="h-4 w-4" />
              <span>Resume Course</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-1.5 bg-[#6C47FF] hover:bg-[#5835E5] active:scale-[0.97] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm shadow-[#6C47FF]/20 transition-all cursor-pointer"
            id="nav-new-btn"
          >
            <Plus className="h-4 w-4 stroke-[3px]" />
            <span>New Course</span>
          </button>

        </div>
      </div>
    </nav>
  );
}