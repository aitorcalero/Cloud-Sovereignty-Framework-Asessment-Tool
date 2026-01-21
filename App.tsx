
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { SOV_ID, Language, AssessmentState } from './types';
import { getSovereigntyObjectives, getSealDefinitions } from './constants';
import { translations } from './i18n';
import ObjectiveCard from './components/ObjectiveCard';
import SovereigntyRadar from './components/SovereigntyRadar';
import ChatWidget from './components/ChatWidget';
import { getSovereigntyAdvice, autoAssessSolution, describeArchitectureDiagram } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('es');
  const [globalSolution, setGlobalSolution] = useState("");
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const objectives = useMemo(() => getSovereigntyObjectives(lang), [lang]);
  const sealDefs = useMemo(() => getSealDefinitions(lang), [lang]);
  const t = translations[lang];

  const [assessment, setAssessment] = useState<AssessmentState>({
    scores: objectives.reduce((acc, obj) => ({ ...acc, [obj.id]: 0 }), {} as Record<SOV_ID, number>),
    notes: objectives.reduce((acc, obj) => ({ ...acc, [obj.id]: '' }), {} as Record<SOV_ID, string>),
  });

  const [aiAdvice, setAiAdvice] = useState<{ objective: string; text: string } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const globalScore = useMemo(() => {
    return objectives.reduce((acc, obj) => {
      const score = assessment.scores[obj.id] || 0;
      const normalizedScore = score / 4;
      return acc + (normalizedScore * obj.weight);
    }, 0) * 100;
  }, [assessment.scores, objectives]);

  const handleScoreChange = useCallback((id: SOV_ID, score: number) => {
    setAssessment(prev => ({
      ...prev,
      scores: { ...prev.scores, [id]: score }
    }));
  }, []);

  const handleNoteChange = useCallback((id: SOV_ID, note: string) => {
    setAssessment(prev => ({
      ...prev,
      notes: { ...prev.notes, [id]: note }
    }));
  }, []);

  const handleAskAI = async (id: SOV_ID) => {
    const objective = objectives.find(o => o.id === id);
    if (!objective) return;

    setIsLoadingAi(true);
    setAiAdvice({ objective: objective.name, text: t.aiConsulting });
    
    const advice = await getSovereigntyAdvice(
      objective.name,
      objective.factors,
      assessment.notes[id],
      lang
    );

    setAiAdvice({ objective: objective.name, text: advice || "" });
    setIsLoadingAi(false);
  };

  const handleGlobalAutoAssess = async () => {
    if (!globalSolution.trim()) return;
    setIsGlobalLoading(true);
    
    const statuses = [
      t.statusStrategic, t.statusLegal, t.statusData, 
      t.statusOps, t.statusSupply, t.statusTech, 
      t.statusSecurity, t.statusGreen
    ];
    let sIdx = 0;
    const interval = setInterval(() => {
      setStatusMessage(statuses[sIdx % statuses.length]);
      sIdx++;
    }, 1500);

    try {
      const result = await autoAssessSolution(globalSolution, lang);
      if (result && result.assessments) {
        const newScores = { ...assessment.scores };
        const newNotes = { ...assessment.notes };
        
        result.assessments.forEach((item: any) => {
          const id = item.id as SOV_ID;
          if (newScores.hasOwnProperty(id)) {
            const validScore = Math.max(0, Math.min(4, Math.round(item.score || 0)));
            newScores[id] = validScore;
            newNotes[id] = item.justification || "";
          }
        });
        
        setAssessment({ scores: newScores, notes: newNotes });
      }
    } finally {
      clearInterval(interval);
      setIsGlobalLoading(false);
      setStatusMessage("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImageLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setUploadedImageUrl(dataUrl);
      const base64 = dataUrl.split(',')[1];
      const description = await describeArchitectureDiagram(base64, file.type, lang);
      if (description) {
        setGlobalSolution(prev => (prev ? prev + "\n\n" + description : description));
      } else {
        alert(t.imageError);
      }
      setIsImageLoading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCopyReport = () => {
    let reportText = `${t.title} - ${t.subtitle}\n`;
    reportText += `------------------------------------------\n`;
    reportText += `${t.globalScore}: ${globalScore.toFixed(1)}%\n\n`;
    
    objectives.forEach(obj => {
      const score = assessment.scores[obj.id] || 0;
      const sealInfo = sealDefs[score] || sealDefs[0];
      reportText += `[${obj.id}] ${obj.name}\n`;
      reportText += `${t.sealLevel}: SEAL-${score} (${sealInfo.name})\n`;
      reportText += `${t.evidence}:\n${assessment.notes[obj.id] || '---'}\n\n`;
    });

    navigator.clipboard.writeText(reportText).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    });
  };

  return (
    <div className="min-h-screen pb-20 font-sans selection:bg-blue-100 bg-slate-50">
      <header className="bg-slate-900 text-white p-6 sticky top-0 z-50 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-inner">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">{t.title}</h1>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
              <button onClick={() => setLang('es')} className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${lang === 'es' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>ES</button>
              <button onClick={() => setLang('en')} className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>EN</button>
            </div>
            <div className="text-center hidden sm:block border-x border-slate-700 px-6">
              <div className="text-3xl font-black text-blue-400 leading-none">{globalScore.toFixed(1)}%</div>
              <div className="text-[9px] uppercase tracking-widest font-bold text-slate-500 mt-1">{t.globalScore}</div>
            </div>
            <button 
              onClick={handleCopyReport} 
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${copyFeedback ? 'bg-green-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'}`}
            >
              {copyFeedback ? t.reportCopied : t.copyReport}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <section className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-blue-200 shadow-lg">⚡</span> {t.globalAssessTitle}
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">{t.globalAssessDesc}</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isImageLoading || isGlobalLoading}
                className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-2xl font-black text-sm transition-all hover:bg-blue-50 disabled:opacity-50"
              >
                {isImageLoading ? '...' : t.uploadDiagram}
              </button>

              {uploadedImageUrl && (
                <button 
                  onClick={() => setIsViewModalOpen(true)}
                  className="bg-blue-50 border-2 border-blue-200 text-blue-700 px-6 py-3 rounded-2xl font-black text-sm transition-all hover:bg-blue-100 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  {t.viewDiagram}
                </button>
              )}

              <button 
                onClick={handleGlobalAutoAssess}
                disabled={isGlobalLoading || !globalSolution.trim()}
                className="bg-slate-900 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl disabled:opacity-40"
              >
                {isGlobalLoading ? (statusMessage || t.thinking) : t.globalAssessBtn}
              </button>
            </div>
          </div>
          <div className="p-6 relative">
            <textarea 
              value={globalSolution}
              onChange={(e) => setGlobalSolution(e.target.value)}
              placeholder={t.globalAssessPlaceholder}
              className="w-full h-32 text-slate-900 bg-slate-50 p-5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none transition-all leading-relaxed"
            />
          </div>
        </section>

        {isViewModalOpen && uploadedImageUrl && (
          <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800">{t.viewDiagram}</h3>
                <button onClick={() => setIsViewModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 p-2 rounded-xl text-slate-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-50">
                <img src={uploadedImageUrl} alt="Architecture Diagram" className="max-w-full h-auto rounded-lg shadow-md" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
              <span className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg">01</span>
              {t.step1}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {objectives.map((obj) => (
                <ObjectiveCard
                  key={obj.id}
                  objective={obj}
                  lang={lang}
                  sealDefinitions={sealDefs}
                  score={assessment.scores[obj.id] || 0}
                  note={assessment.notes[obj.id]}
                  onScoreChange={(score) => handleScoreChange(obj.id, score)}
                  onNoteChange={(note) => handleNoteChange(obj.id, note)}
                  onAskAI={() => handleAskAI(obj.id)}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-7 lg:sticky lg:top-32">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex justify-between items-center">
                {t.balance}
                <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold">{globalScore.toFixed(0)}%</span>
              </h2>
              <div className="min-h-[300px] w-full">
                <SovereigntyRadar scores={assessment.scores} lang={lang} />
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center text-[13px] font-bold">
                  <span className="text-slate-500 uppercase">{t.avgMaturity}</span>
                  <span className="text-slate-900 bg-slate-100 px-2 py-1 rounded">
                    {((Object.values(assessment.scores) as number[]).reduce((a, b) => a + b, 0) / 8).toFixed(1)} / 4
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-700" style={{ width: `${globalScore}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ChatWidget lang={lang} />
    </div>
  );
};

export default App;
