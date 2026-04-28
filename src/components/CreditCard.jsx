import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { CARD_THEMES } from '../data/policies';

export default function CreditCard({ bank, cardName, theme, network }) {
  const themeData = CARD_THEMES.find(t => t.id === theme) || CARD_THEMES[0];

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 });
  const glareX  = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glareY  = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  function handleMouse(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top)  / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const networkSymbol = {
    Visa: 'VISA',
    Mastercard: '◉◉',
    RuPay: 'RuPay',
    'American Express': 'AMEX',
    'Diners Club': 'Diners',
  }[network] || '';

  return (
    <motion.div
      style={{ perspective: 1000 }}
      className="card-wrapper"
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          borderRadius: 20,
          aspectRatio: '1.586',
          width: '100%',
          background: `linear-gradient(135deg, ${themeData.from}, ${themeData.via}, ${themeData.to})`,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
          cursor: 'none',
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ scale: { duration: 0.3 } }}
      >
        {/* Glare */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.12) 0%, transparent 60%)`,
          }}
        />

        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        {/* Hologram circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', top: '10%', left: '6%',
            width: '10%', aspectRatio: '1',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #f0d080, #4f8ef7, #22d3a5, #7c5cfc, #f0d080)',
            opacity: 0.5, filter: 'blur(1px)',
          }}
        />

        {/* Chip */}
        <div style={{
          position: 'absolute', top: '22%', left: '7%',
          width: '14%', aspectRatio: '1.4',
          background: 'linear-gradient(135deg, #c9a84c, #f0d080, #c9a84c)',
          borderRadius: 4, overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: '22% 0', background: 'rgba(0,0,0,0.3)' }} />
          <div style={{ position: 'absolute', inset: '0 22%', background: 'rgba(0,0,0,0.3)' }} />
        </div>

        {/* NFC */}
        <div style={{
          position: 'absolute', top: '24%', left: '25%',
          color: 'rgba(255,255,255,0.35)', fontSize: 'clamp(12px,3vw,18px)',
          transform: 'rotate(90deg)', fontFamily: 'monospace',
        }}>
          (·))
        </div>

        {/* Bank */}
        <div style={{
          position: 'absolute', top: '8%', right: '6%',
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: 'clamp(10px,2.5vw,14px)',
          color: 'rgba(255,255,255,0.75)', letterSpacing: 0.5,
        }}>
          {bank || 'YOUR BANK'}
        </div>

        {/* Card number */}
        <div style={{
          position: 'absolute', bottom: '30%', left: '7%', right: '7%',
          fontFamily: 'Syne, monospace', fontWeight: 500,
          fontSize: 'clamp(11px,3vw,16px)', letterSpacing: 3,
          color: 'rgba(255,255,255,0.85)',
        }}>
          •••• &nbsp;•••• &nbsp;•••• &nbsp;••••
        </div>

        {/* Name */}
        <div style={{
          position: 'absolute', bottom: '13%', left: '7%',
          fontFamily: 'Syne, sans-serif', fontWeight: 500,
          fontSize: 'clamp(9px,2.2vw,12px)', letterSpacing: 2,
          color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase',
        }}>
          {cardName || 'CARDHOLDER NAME'}
        </div>

        {/* Expiry */}
        <div style={{
          position: 'absolute', bottom: '13%', left: '50%',
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(7px,1.8vw,10px)', color: 'rgba(255,255,255,0.5)',
        }}>
          <div style={{ fontSize: '0.7em', letterSpacing: 1, marginBottom: 2 }}>VALID THRU</div>
          <div>MM/YY</div>
        </div>

        {/* Network logo */}
        {network === 'Mastercard' ? (
          <div style={{ position: 'absolute', bottom: '8%', right: '6%', display: 'flex' }}>
            <div style={{ width: 'clamp(18px,4vw,28px)', height: 'clamp(18px,4vw,28px)', borderRadius: '50%', background: '#eb001b', marginRight: -6, zIndex: 1 }} />
            <div style={{ width: 'clamp(18px,4vw,28px)', height: 'clamp(18px,4vw,28px)', borderRadius: '50%', background: '#f79e1b', opacity: 0.9 }} />
          </div>
        ) : (
          <div style={{
            position: 'absolute', bottom: '10%', right: '6%',
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            fontSize: 'clamp(9px,2.5vw,14px)', color: 'rgba(255,255,255,0.6)',
            letterSpacing: 1,
          }}>
            {networkSymbol}
          </div>
        )}

        {/* Shine stripe */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        }} />
      </motion.div>
    </motion.div>
  );
}
