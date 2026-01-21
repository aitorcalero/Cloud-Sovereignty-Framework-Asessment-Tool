
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
  lang?: Language;
}

const SovereigntyRadar = ({ scores, lang = 'es' as Language }: SovereigntyRadarProps) => {
  const objectives = useMemo(() => getSovereigntyObjectives(lang), [lang]);

  const data = objectives.map((obj) => ({
    subject: obj.id,
    A: scores[obj.id] || 0,
    fullMark: 4,
    name: obj.name
  }));

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 4]} 
            tick={{ fill: '#94a3b8', fontSize: 8 }} 
            axisLine={false}
          />
          <Radar
            name="Nivel SEAL"
            dataKey="A"
            stroke="#2563eb"
            strokeWidth={3}
            fill="#3b82f6"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SovereigntyRadar;
