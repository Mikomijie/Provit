import React, { useState, useRef } from "react";
import { UploadCloud, Sparkles, FileText, CheckCircle, ArrowRight, BookOpen, Brain, Wand2, Info } from "lucide-react";

interface UploadPageProps {
  initialMode: 'topic' | 'material';
  onGenerate: (params: { topic?: string; materialText?: string; pdfBase64?: string; difficultyLevel: string }) => void;
  isGenerating: boolean;
}

export default function UploadPage({ initialMode, onGenerate, isGenerating }: UploadPageProps) {
  const [mode, setMode] = useState<'topic' | 'material'>(initialMode);
  const [topic, setTopic] = useState("");
  const [materialText, setMaterialText] = useState("");
  const [pdfBase64, setPdfBase64] = useState<string | undefined>(undefined);
  const [difficultyLevel, setDifficultyLevel] = useState("Beginner to Intermediate");
  const [fileName, setFileName] = useState("");
  const [fileReadingMsg, setFileReadingMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingPhase, setLoadingPhase] = useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setLoadingPhase(0);
      interval = setInterval(() => {
        setLoadingPhase((prev) => (prev < 3 ? prev + 1 : 0));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const loadingSteps = [
    { text: "Reading your material...", icon: BookOpen },
    { text: "Building 5 lessons just for you...", icon: Brain },
    { text: "Creating proof of understanding challenges...", icon: Sparkles },
    { text: "Almost ready...", icon: Wand2 }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const readFile = (file: File) => {
    if (!file) return;

    const name = file.name.toLowerCase();
    if (name.endsWith('.pptx') || name.endsWith('.ppt') || name.endsWith('.doc') || name.endsWith('.docx')) {
      setFileReadingMsg("❌ This file type isn't supported. Please upload a PDF or paste your text directly.");
      setFileName(file.name);
      return;
    }

    setFileName(file.name);
    setFileReadingMsg("Reading file...");
    setPdfBase64(undefined);
    setMaterialText("");

    if (name.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string)?.split(',')[1];
        if (base64) {
          setPdfBase64(base64);
          setFileReadingMsg(`PDF loaded: ${file.name} — Ready to generate!`);
        } else {
          setFileReadingMsg("Could not read PDF. Please paste text directly.");
        }
      };
      reader.onerror = () => setFileReadingMsg("Failed to read PDF.");
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        setMaterialText(text);
        setFileReadingMsg(`Loaded: ${file.name} — Ready to generate!`);
      } else {
        setFileReadingMsg("Error reading file. Please paste text directly.");
      }
    };
    reader.onerror = () => setFileReadingMsg("Failed to read file.");
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) readFile(e.target.files[0]);
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'topic' && !topic.trim()) {
      alert("Please enter a topic to learn.");
      return;
    }
    if (mode === 'material' && !materialText.trim() && !pdfBase64 && !topic.trim()) {
      alert("Please upload a PDF, paste text, or enter a topic.");
      return;
    }
    onGenerate({
      topic: topic.trim() || undefined,
      materialText: mode === 'material' && !pdfBase64 ? materialText : undefined,
      pdfBase64: mode === 'material' ? pdfBase64 : undefined,
      difficultyLevel
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:px-6 sm:py-12" id="upload-layout">

      {isGenerating ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl text-center flex flex-col items-center space-y-8" id="loading-box">
          <div className="relative flex items-center justify-center w-28 h-28">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[#6C47FF] border-r-[#FF6B6B] animate-spin"></div>
            <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-[#6C47FF]/10 to-[#FF6B6B]/10 flex items-center justify-center">
              {React.createElement(loadingSteps[loadingPhase].icon, {
                className: "h-7 w-7 text-[#6C47FF] animate-pulse"
              })}
            </div>
          </div>

          <div className="space-y-3.5">
            <h3 className="font-bold text-2xl text-gray-900 tracking-tight">
              Building Your Course
            </h3>
            <div className="flex items-center justify-center space-x-2">
              {loadingSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === loadingPhase ? "w-6 bg-[#6C47FF]" : "w-2 bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 text-[15px] max-w-sm mx-auto font-medium py-1">
              "{loadingSteps[loadingPhase].text}"
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs text-gray-400 w-full text-left flex items-start space-x-2.5">
            <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
            <span>Provit is building your personal course. This takes roughly 15-20 seconds. Hang tight!</span>
          </div>
        </div>

      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl" id="input-card">
          <div className="text-center mb-6">
            <h2 className="font-extrabold text-xl sm:text-2xl text-gray-950 tracking-tight">
              Generate My Personal Course
            </h2>
            <p className="text-gray-500 text-sm mt-1">Select your mode below</p>
          </div>

          {/* Tab switcher — fixed for mobile */}
          <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-6 gap-1">
            <button
              onClick={() => { setMode('topic'); setMaterialText(''); setPdfBase64(undefined); setFileName(''); }}
              className={`flex-1 py-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                mode === 'topic' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FF6B6B] shrink-0" />
              <span>Learn a Topic</span>
            </button>
            <button
              onClick={() => { setMode('material'); setTopic(''); }}
              className={`flex-1 py-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                mode === 'material' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-[#6C47FF] shrink-0" />
              <span>Upload Material</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {mode === 'topic' ? (
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  What do you want to learn?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Photosynthesis, Nigerian history, React hooks..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/20 focus:border-[#6C47FF] transition-all"
                  required
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
                    dragActive ? "border-[#6C47FF] bg-[#6C47FF]/5" : "border-gray-200 bg-gray-50 hover:bg-gray-100/40"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.csv,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="p-3.5 bg-white rounded-full shadow-sm border border-gray-100">
                    <UploadCloud className="h-6 w-6 text-[#6C47FF]" />
                  </div>
                  <p className="font-bold text-sm text-gray-800 mt-4">Drag and drop your study file</p>
                  <p className="text-[11px] text-gray-400 mt-1">Supports .pdf, .txt, .md, .csv</p>
                  <button type="button" className="mt-3.5 px-4 py-1.5 bg-white border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg shadow-sm">
                    Browse Files
                  </button>
                </div>

                {fileName && (
                  <div className={`p-3.5 border rounded-2xl text-xs flex items-center space-x-2.5 ${
                    fileReadingMsg.includes('❌')
                      ? 'bg-red-50 border-red-100 text-red-700'
                      : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                  }`}>
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span className="font-medium">{fileReadingMsg}</span>
                  </div>
                )}

                <div className="flex items-center space-x-3.5 justify-center text-xs text-gray-400 uppercase tracking-wider">
                  <div className="h-[1px] bg-gray-100 w-full"></div>
                  <span className="whitespace-nowrap">or paste directly</span>
                  <div className="h-[1px] bg-gray-100 w-full"></div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Paste Lecture, Book Text, or Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Paste your notes or study material here..."
                    value={materialText}
                    onChange={(e) => setMaterialText(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/20 focus:border-[#6C47FF] transition-all font-sans leading-relaxed"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Optional: Topic Title
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Cell Division"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-[#6C47FF] transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Difficulty Level
              </label>
              <select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/20 focus:border-[#6C47FF] transition-all"
              >
                <option value="Beginner level">Beginner (Basic concepts first)</option>
                <option value="Beginner to Intermediate">Beginner to Intermediate (Balanced)</option>
                <option value="Advanced Masterclass">Advanced (Deeper concepts)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#6C47FF] hover:bg-[#5835E5] text-white rounded-2xl font-bold tracking-wide shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Generate My Course</span>
              <ArrowRight className="h-5 w-5" />
            </button>

          </form>
        </div>
      )}
    </div>
  );
}