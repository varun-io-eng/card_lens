import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ALL_POLICIES, CATEGORIES } from '../data/policies';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a1d26', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#eeedf0',
      }}>
        <div style={{ fontWeight: 600 }}>{payload[0].payload.category}</div>
        <div style={{ color: '#9d9bab', marginTop: 2 }}>
          Coverage: <span style={{ color: '#22d3a5', fontWeight: 600 }}>{Math.round(payload[0].value)}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function PolicyChart({ policies }) {
  const cats = CATEGORIES.filter(c => c !== 'All');

  const data = cats.map(cat => {
    const inCat = ALL_POLICIES.filter(p => p.category === cat);
    const hasCount = inCat.filter(p => policies[p.id] === 'has').length;
    const partialCount = inCat.filter(p => policies[p.id] === 'partial').length;
    const score = inCat.length === 0 ? 0 : Math.round(((hasCount + partialCount * 0.5) / inCat.length) * 100);
    return { category: cat, value: score, fullMark: 100 };
  });

  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="rgba(255,255,255,0.07)" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#9d9bab', fontSize: 11, fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
          />
          <Radar
            name="Coverage"
            dataKey="value"
            stroke="#4f8ef7"
            fill="#4f8ef7"
            fillOpacity={0.18}
            strokeWidth={2}
            dot={{ fill: '#4f8ef7', r: 3 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
