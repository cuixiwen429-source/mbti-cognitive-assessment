import { useState, useEffect } from 'react';
import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import type { FunctionScores } from '../types';
import { FUNC_NAMES, FUNC_LABELS } from '../types';

const FUNC_COLORS: Record<string, string> = {
  Se: '#f59e0b', Si: '#d97706',
  Ne: '#10b981', Ni: '#059669',
  Te: '#3b82f6', Ti: '#2563eb',
  Fe: '#ec4899', Fi: '#db2777',
};

interface RadarChartProps {
  scores: FunctionScores;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return mobile;
}

export default function RadarChart({ scores }: RadarChartProps) {
  const isMobile = useIsMobile();

  const data = FUNC_NAMES.map((f) => ({
    function: isMobile ? FUNC_LABELS[f].replace('外倾', '外').replace('内倾', '内') : FUNC_LABELS[f],
    value: (scores as any)[f],
    code: f,
  }));

  return (
    <div className="bg-surface dark:bg-slate-800 rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-base sm:text-lg font-semibold text-text dark:text-slate-100 mb-1 text-center">
        认知功能雷达图
      </h3>
      <ResponsiveContainer width="100%" height={isMobile ? 270 : 360}>
        <RechartsRadar data={data} cx="50%" cy="50%" outerRadius={isMobile ? '62%' : '72%'}>
          <PolarGrid stroke="#475569" strokeOpacity={0.3} />
          <PolarAngleAxis
            dataKey="function"
            tick={{ fontSize: isMobile ? 10 : 12, fill: '#94a3b8' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: '#64748b' }}
            stroke="#475569"
            strokeOpacity={0.3}
          />
          <Radar
            name="认知功能"
            dataKey="value"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RechartsRadar>
      </ResponsiveContainer>

      <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-1 mt-1">
        {FUNC_NAMES.map((f) => (
          <div key={f} className="flex items-center gap-1">
            <div
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: FUNC_COLORS[f] }}
            />
            <span className="text-[10px] sm:text-xs text-text-muted dark:text-slate-400 whitespace-nowrap">
              {FUNC_LABELS[f].replace('外倾', '外').replace('内倾', '内')}: {(scores as any)[f]}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
