import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  has:     { label: '✓ Included',     color: '#22d3a5', bg: 'rgba(34,211,165,0.1)',  border: 'rgba(34,211,165,0.25)', left: '#22d3a5' },
  partial: { label: '~ Partial',      color: '#f7c15c', bg: 'rgba(247,193,92,0.1)',  border: 'rgba(247,193,92,0.25)', left: '#f7c15c' },
  not:     { label: '✗ Not Included', color: '#f75c5c', bg: 'rgba(247,92,92,0.1)',   border: 'rgba(247,92,92,0.25)',  left: '#f75c5c' },
};

export default function PolicyItem({ policy, status, index }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.not;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      whileHover={{ x: 4, transition: { duration: 0.15 } }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        background: '#12141a',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: `2px solid ${cfg.left}`,
        borderRadius: 12, padding: '12px 14px',
        cursor: 'default',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: cfg.bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 15,
      }}>
        {policy.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#eeedf0', marginBottom: 2 }}>
          {policy.name}
        </div>
        <div style={{ fontSize: 11.5, color: '#9d9bab', lineHeight: 1.5 }}>
          {policy.desc}
        </div>
        <div style={{
          display: 'inline-block', marginTop: 6,
          fontSize: 10, fontWeight: 600, padding: '3px 9px',
          borderRadius: 20, letterSpacing: 0.3,
          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
        }}>
          {cfg.label}
        </div>
      </div>

      {/* Category tag */}
      <div style={{
        fontSize: 10, color: '#5e5c72', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, padding: '2px 8px', flexShrink: 0, fontWeight: 500,
        letterSpacing: 0.3,
      }}>
        {policy.category}
      </div>
    </motion.div>
  );
}
