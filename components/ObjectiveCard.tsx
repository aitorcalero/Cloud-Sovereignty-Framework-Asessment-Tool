
import React, { useState } from 'react';
import { SovereigntyObjective, SEAL_Definition, Language } from '../types';
import { translations } from '../i18n';
import { getSealGuidance } from '../services/geminiService';

interface ObjectiveCardProps {
  objective: SovereigntyObjective;
  score: number;
  note: string;
  lang: Language;
  sealDefinitions: SEAL_Definition[];
  onScoreChange: (score: number) => void;
  onNoteChange: (note: string) => void;
  onAskAI: () => void;
}

const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  score,
  note,
  lang,
  sealDefinitions,
  onScoreChange,
  onNoteChange,
  onAskAI
}) => {
  const t = translations[lang];
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const [guidanceText, setGuidanceText] = useState("");
  const [loadingGuidance, setLoadingGuidance] = useState(false);

  const handleGenerateGuidance = async () => {
    if (!note) return;
    setLoadingGuidance(true);
    setIsGuidanceOpen(true);
    const result = await getSealGuidance(objective.name, objective.factors, note, lang);
    setGuidanceText(result || "");
    setLoadingGuidance(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4 relative">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-2 inline-block">
            {objective.id} ({(objective.weight * 100).toFixed(0)}%)
          </span>
          <h3 className="text-lg font-bold text-slate-800">{objective.name}</h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{objective.description}</p>
        </div>
      </div>

      <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100">
        <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2">{t.factors}</h4>
        <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
          {objective.factors.map((factor, idx) => (
            <li key={idx}>{factor}</li>
          ))}
        </ul>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          {t.sealLevel}
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map((level) => (
            <button
              key={level}
              onClick={() => onScoreChange(level)}
              className={`p-2 rounded-md text-sm font-bold transition-all ${
                score === level
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-slate-50'
              }`}
              title={sealDefinitions[level].description}
            >
              L{level}
            </button>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-slate-500 leading-tight">
          <span className="font-bold text-slate-700">{sealDefinitions[score].name}:</span> {sealDefinitions[score].description}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="block text-sm font-bold text-slate-700">{t.evidence}</label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder={t.evidencePlaceholder}
          className="w-full text-[13px] border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[140px] bg-white text-slate-900 font-medium placeholder:text-slate-400 shadow-inner leading-relaxed transition-all"
        />
        
        <div className="flex justify-between items-center mt-1">
          <button
            onClick={handleGenerateGuidance}
            disabled={!note || loadingGuidance}
            className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 disabled:opacity-30 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.askGuidance}
          </button>
          
          <button
            onClick={onAskAI}
            disabled={!note}
            className="text-[11px] font-bold text-blue-700 hover:text-white hover:bg-blue-600 self-end disabled:opacity-50 flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full transition-all active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
            {t.askAi}
          </button>
        </div>
      </div>

      {isGuidanceOpen && (
        <div className="absolute inset-0 z-10 bg-white rounded-xl flex flex-col p-6 shadow-2xl border-2 border-blue-500 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
               <span className="text-blue-600 text-lg">★</span> {t.guidanceTitle}
            </h4>
            <button onClick={() => setIsGuidanceOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto text-xs text-slate-800 leading-relaxed font-medium">
            {loadingGuidance ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="animate-pulse font-bold text-blue-600 uppercase tracking-widest">{t.thinking}</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{guidanceText}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectiveCard;
