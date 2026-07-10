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

export default function RadarChart({ scores }: RadarChartProps) {
  const data = FUNC_NAMES.map((f) => ({
    function: FUNC_LABELS[f],
    value: (scores as any)[f],
    code: f,
  }));

  return (
    <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-text dark:text-slate-100 mb-2 text-center">
        认知功能雷达图
      </h3>
      <ResponsiveContainer width="100%" height={340}>
        <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#475569" strokeOpacity={0.3} />
          <PolarAngleAxis
            dataKey="function"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#64748b' }}
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

      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {FUNC_NAMES.map((f) => (
          <div key={f} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: FUNC_COLORS[f] }}
            />
            <span className="text-xs text-text-muted dark:text-slate-400">
              {FUNC_LABELS[f]}: {(scores as any)[f]}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
