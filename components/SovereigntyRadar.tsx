
import React, { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { getSovereigntyObjectives } from '../constants';
import { SOV_ID, Language } from '../types';

interface SovereigntyRadarProps {
  scores: Record<string, number>;
  lang?: Language; // Added lang support for dynamic labels
}

// Fixed: Explicitly typed props and provided cast for default value to avoid widening to 'string'
// Removed React.FC for better TypeScript inference of prop types and default values
const SovereigntyRadar = ({ scores, lang = 'es' as Language }: SovereigntyRadarProps) => {
  const objectives = useMemo(() => getSovereigntyObjectives(lang), [lang]);

  const data = objectives.map((obj) => ({
    subject: obj.id,
    A: scores[obj.id],
    fullMark: 4,
    name: obj.name
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 4]} />
          <Radar
            name="Nivel SEAL"
            dataKey="A"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SovereigntyRadar;
