
import React from 'react';
import { SovereigntyObjective, SEAL_Definition, Language } from '../types';
import { translations } from '../i18n';

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-2 inline-block">
            {objective.id} ({(objective.weight * 100).toFixed(0)}%)
          </span>
          <h3 className="text-lg font-bold text-slate-800">{objective.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{objective.description}</p>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg">
        <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2">{t.factors}</h4>
        <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
          {objective.factors.map((factor, idx) => (
            <li key={idx}>{factor}</li>
          ))}
        </ul>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t.sealLevel}
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map((level) => (
            <button
              key={level}
              onClick={() => onScoreChange(level)}
              className={`p-2 rounded-md text-sm font-medium transition-all ${
                score === level
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
              title={sealDefinitions[level].description}
            >
              L{level}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-slate-500 italic">
          {sealDefinitions[score].name}: {sealDefinitions[score].description}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-slate-700">{t.evidence}</label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder={t.evidencePlaceholder}
          className="w-full text-sm border border-slate-200 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[80px]"
        />
        <button
          onClick={onAskAI}
          disabled={!note}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 self-end disabled:opacity-50 flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
          </svg>
          {t.askAi}
        </button>
      </div>
    </div>
  );
};

export default ObjectiveCard;
