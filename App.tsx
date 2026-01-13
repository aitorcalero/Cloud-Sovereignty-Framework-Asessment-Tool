
import React, { useState, useMemo, useCallback } from 'react';
import { SOV_ID, Language, AssessmentState } from './types';
import { getSovereigntyObjectives, getSealDefinitions } from './constants';
import { translations } from './i18n';
import ObjectiveCard from './components/ObjectiveCard';
import SovereigntyRadar from './components/SovereigntyRadar';
import { getSovereigntyAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('es');
  
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
      const normalizedScore = assessment.scores[obj.id] / 4;
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

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white p-6 sticky top-0 z-50 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">{t.title}</h1>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            {/* Language Toggle */}
            <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button 
                onClick={() => setLang('es')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'es' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                ES
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            <div className="text-center hidden sm:block">
              <div className="text-3xl font-black text-blue-400">{globalScore.toFixed(1)}%</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">{t.globalScore}</div>
            </div>
            <div className="h-10 w-px bg-slate-700 hidden sm:block" />
            <button 
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
            >
              {t.export}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              {t.step1}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {objectives.map((obj) => (
                <ObjectiveCard
                  key={obj.id}
                  objective={obj}
                  lang={lang}
                  sealDefinitions={sealDefs}
                  score={assessment.scores[obj.id]}
                  note={assessment.notes[obj.id]}
                  onScoreChange={(score) => handleScoreChange(obj.id, score)}
                  onNoteChange={(note) => handleNoteChange(obj.id, note)}
                  onAskAI={() => handleAskAI(obj.id)}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8 sticky top-28 h-fit">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">{t.balance}</h2>
            {/* Added lang prop to ensure Radar chart labels and tooltips update correctly */}
            <SovereigntyRadar scores={assessment.scores} lang={lang} />
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">{t.avgMaturity}</span>
                <span className="font-bold">
                  {((Object.values(assessment.scores) as number[]).reduce((a, b) => a + b, 0) / 8).toFixed(1)} / 4
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-1000" 
                  style={{ width: `${globalScore}%` }}
                />
              </div>
            </div>
          </section>

          <section className="bg-blue-900 rounded-xl shadow-lg border border-blue-800 p-6 text-white min-h-[300px] flex flex-col">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
              </svg>
              {t.aiAdvisor}
            </h2>
            
            {aiAdvice ? (
              <div className="flex-1 flex flex-col">
                <div className="text-xs text-blue-300 font-bold uppercase mb-2">{t.objective}: {aiAdvice.objective}</div>
                <div className="text-sm leading-relaxed overflow-y-auto max-h-[400px] bg-blue-950/50 p-3 rounded-lg border border-blue-800 whitespace-pre-wrap">
                  {aiAdvice.text}
                </div>
                {isLoadingAi && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-blue-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    {t.aiAnalyzing}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                <svg className="w-12 h-12 mb-4 text-blue-300/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-sm">{t.aiInitial}</p>
              </div>
            )}
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-3">{t.sealGuide}</h2>
            <div className="space-y-3">
              {sealDefs.map((seal) => (
                <div key={seal.level} className="text-xs group">
                  <span className="font-bold text-slate-700 block mb-0.5 group-hover:text-blue-600">SEAL-{seal.level}: {seal.name}</span>
                  <p className="text-slate-500">{seal.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 md:hidden flex justify-between items-center px-8">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">SCORE</span>
          <span className="text-lg font-black text-blue-600">{globalScore.toFixed(0)}%</span>
        </div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </footer>
    </div>
  );
};

export default App;
