import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { FunctionScores } from '../types';
import { FUNC_NAMES, FUNC_LABELS } from '../types';

interface CompareChartProps {
  data: { label: string; scores: FunctionScores }[];
}

export default function CompareChart({ data }: CompareChartProps) {
  if (data.length < 2) {
    return (
      <div className="text-center py-8 text-text-muted dark:text-slate-400 text-sm">
        请选择至少 2 条记录进行对比
      </div>
    );
  }

  // Transform for Recharts: one data point per function per test
  const chartData = FUNC_NAMES.map((f) => {
    const point: Record<string, string | number> = { function: FUNC_LABELS[f].replace('外倾', '外').replace('内倾', '内') };
    data.forEach((d, i) => {
      point[`test${i}`] = (d.scores as unknown as Record<string, number>)[f];
    });
    return point;
  });

  return (
    <div className="bg-surface dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-text dark:text-slate-200 mb-1 text-center">
        功能变化对比
      </h3>
      <p className="text-[11px] sm:text-xs text-text-muted dark:text-slate-500 text-center mb-3">
        同一功能在不同测评中的分数变化
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" strokeOpacity={0.2} />
          <XAxis dataKey="function" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b', border: '1px solid #334155',
              borderRadius: '8px', fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          {data.map((_, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={`test${i}`}
              name={data[i].label}
              stroke={['#6366f1', '#f59e0b', '#10b981', '#ec4899'][i % 4]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend cards */}
      <div className="flex flex-wrap gap-2 justify-center mt-3">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px] sm:text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ec4899'][i % 4] }}
            />
            <span className="text-text-muted dark:text-slate-400">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
