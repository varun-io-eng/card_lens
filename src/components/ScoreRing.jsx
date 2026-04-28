import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScoreRing({ score, size = 100 }) {
  const [display, setDisplay] = useState(0);
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * score) / 100;
  const color = score >= 70 ? '#22d3a5' : score >= 45 ? '#f7c15c' : '#f75c5c';

  useEffect(() => {
    let start = null;
    const duration = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setDisplay(Math.round(score * progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'Syne, sans-serif', fontSize: size * 0.22,
          fontWeight: 700, lineHeight: 1, color,
        }}>{display}</span>
        <span style={{ fontSize: size * 0.1, color: '#5e5c72', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>
          score
        </span>
      </div>
    </div>
  );
}
