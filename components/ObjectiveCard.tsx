
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

  // Safety: ensure score is valid index
  const safeScore = Math.max(0, Math.min(4, Math.round(score || 0)));
  const sealInfo = sealDefinitions[safeScore] || sealDefinitions[0] || { name: 'N/A', description: 'N/A' };

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
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-2 inline-block uppercase tracking-wide">
            {objective.id}
          </span>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">{objective.name}</h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">{objective.description}</p>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{t.factors}</h4>
        <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
          {objective.factors.map((factor, idx) => (
            <li key={idx}>{factor}</li>
          ))}
        </ul>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3">{t.sealLevel}</label>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map((level) => (
            <button
              key={level}
              onClick={() => onScoreChange(level)}
              className={`py-2 rounded-lg text-sm font-black transition-all ${
                safeScore === level
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-400'
              }`}
            >
              L{level}
            </button>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-slate-500 leading-normal">
          <span className="font-bold text-slate-700 uppercase">{sealInfo.name}:</span> {sealInfo.description}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <label className="block text-xs font-black uppercase text-slate-400 tracking-widest">{t.evidence}</label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder={t.evidencePlaceholder}
          className="w-full text-sm border border-slate-200 rounded-xl p-4 focus:ring-4 focus:ring-blue-50 outline-none min-h-[120px] bg-slate-50/30 transition-all font-medium"
        />
        
        <div className="flex justify-between items-center gap-4 mt-2">
          <button
            onClick={handleGenerateGuidance}
            disabled={!note || loadingGuidance}
            className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-colors flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {t.askGuidance}
          </button>
          
          <button
            onClick={onAskAI}
            disabled={!note}
            className="text-[11px] font-bold text-blue-700 hover:text-white hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            {t.askAi}
          </button>
        </div>
      </div>

      {isGuidanceOpen && (
        <div className="absolute inset-0 z-10 bg-white rounded-xl flex flex-col p-6 shadow-2xl border-2 border-blue-500 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h4 className="text-sm font-black text-slate-800">{t.guidanceTitle}</h4>
            <button onClick={() => setIsGuidanceOpen(false)} className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
            {loadingGuidance ? t.thinking : guidanceText}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectiveCard;
