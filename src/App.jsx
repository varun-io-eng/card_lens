import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { ScanLine, RotateCcw, Filter, ChevronDown } from 'lucide-react';

import CreditCard from './components/CreditCard';
import DropZone from './components/DropZone';
import PolicyItem from './components/PolicyItem';
import ScoreRing from './components/ScoreRing';
import PolicyChart from './components/PolicyChart';
import { useAnalyze } from './hooks/useAnalyze';
import { ALL_POLICIES, BANKS, TIERS, NETWORKS, CARD_THEMES, CATEGORIES } from './data/policies';

const SECTION = {
  has:     { label: 'Included',     dot: '#22d3a5' },
  partial: { label: 'Conditional',  dot: '#f7c15c' },
  not:     { label: 'Not Included', dot: '#f75c5c' },
};

export default function App() {
  const { analyze, loading, result, error, agentSteps, reset } = useAnalyze();

  const [form, setForm] = useState({ bank: '', cardName: '', tier: '', fee: '', network: '', features: '' });
  const [theme, setTheme] = useState('navy');
  const [uploaded, setUploaded] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('all');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleAnalyze() {
    if (!form.bank && !form.cardName && !uploaded) {
      toast.error('Please enter card details or upload an image');
      return;
    }
    await analyze({ ...form, imageData: uploaded?.data });
    if (error === 'demo') toast('Showing estimated results — add API key for real AI analysis', { icon: 'ℹ️' });
    else toast.success('Analysis complete!');
  }

  function handleReset() {
    reset();
    setForm({ bank: '', cardName: '', tier: '', fee: '', network: '', features: '' });
    setUploaded(null);
    setActiveFilter('All');
    setActiveTab('all');
  }

  const grouped = result
    ? {
        has:     ALL_POLICIES.filter(p => result.policies?.[p.id] === 'has'),
        partial: ALL_POLICIES.filter(p => result.policies?.[p.id] === 'partial'),
        not:     ALL_POLICIES.filter(p => result.policies?.[p.id] === 'not'),
      }
    : null;

  const filteredGrouped = grouped
    ? {
        has:     grouped.has.filter(p => activeFilter === 'All' || p.category === activeFilter),
        partial: grouped.partial.filter(p => activeFilter === 'All' || p.category === activeFilter),
        not:     grouped.not.filter(p => activeFilter === 'All' || p.category === activeFilter),
      }
    : null;

  const shownPolicies = filteredGrouped
    ? (activeTab === 'all' ? ['has','partial','not'] : [activeTab])
        .flatMap(s => filteredGrouped[s].map(p => ({ policy: p, status: s })))
    : [];

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1a1d26', color: '#eeedf0', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Instrument Sans, sans-serif', fontSize: 13 },
        }}
      />

      {/* BG */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: '#0b0c10',
        backgroundImage: 'linear-gradient(rgba(79,142,247,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.025) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(20px)', background: 'rgba(11,12,16,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0.9rem 0',
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #4f8ef7, #7c5cfc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>💳</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 19, fontWeight: 800, letterSpacing: -0.5, color: '#eeedf0' }}>
              Card<span style={{ color: '#4f8ef7' }}>Lens</span>
            </span>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 500, letterSpacing: 0.3,
            background: 'rgba(79,142,247,0.12)', color: '#4f8ef7',
            border: '1px solid rgba(79,142,247,0.25)', borderRadius: 20, padding: '4px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f8ef7', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            AI Powered
          </div>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1120, margin: '0 auto', padding: '0 2rem 4rem' }}>

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', padding: '4rem 0 2.5rem' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)',
              borderRadius: 30, padding: '5px 16px', fontSize: 11, color: '#4f8ef7',
              fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: '1.5rem',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f8ef7', animation: 'pulse 2s infinite' }} />
            Instant Policy Analysis
          </motion.div>

          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5,
            color: '#eeedf0', marginBottom: '1rem',
          }}>
            Know Every Benefit<br />
            <span style={{
              background: 'linear-gradient(90deg, #4f8ef7, #7c5cfc, #c9a84c)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              On Your Card
            </span>
          </h1>
          <p style={{ fontSize: 16, color: '#9d9bab', maxWidth: 480, margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
            Upload your credit card image or enter details manually. Instantly see which policies are included, partial, or missing.
          </p>
        </motion.div>

        {/* MAIN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: result ? '420px 1fr' : '1fr 1fr', gap: '1.75rem', alignItems: 'start', transition: 'grid-template-columns 0.4s' }}>

          {/* LEFT — INPUT PANEL */}
          <motion.div layout style={{
            background: '#12141a', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, padding: '1.75rem', position: 'sticky', top: 80,
          }}>
            {/* Panel label */}
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#5e5c72', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              Your Card
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* THEME PICKER */}
            <div style={{ display: 'flex', gap: 7, marginBottom: '1rem' }}>
              {CARD_THEMES.map(t => (
                <motion.button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    flex: 1, padding: '7px 4px', borderRadius: 10,
                    border: theme === t.id ? '1px solid #4f8ef7' : '1px solid rgba(255,255,255,0.07)',
                    background: theme === t.id ? 'rgba(79,142,247,0.1)' : 'transparent',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  }}
                >
                  <div style={{ width: 26, height: 14, borderRadius: 4, background: `linear-gradient(135deg, ${t.from}, ${t.to})` }} />
                  <span style={{ fontSize: 10, color: theme === t.id ? '#4f8ef7' : '#5e5c72', fontWeight: 500, fontFamily: 'Instrument Sans, sans-serif' }}>{t.label}</span>
                </motion.button>
              ))}
            </div>

            {/* CARD PREVIEW */}
            <div style={{ marginBottom: '1.5rem' }}>
              <CreditCard
                bank={form.bank}
                cardName={form.cardName}
                theme={theme}
                network={form.network}
              />
            </div>

            {/* DROP ZONE */}
            <DropZone onFile={setUploaded} uploaded={uploaded} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '1.1rem 0', color: '#5e5c72', fontSize: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              or enter manually
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* FORM */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Card Name / Type', key: 'cardName', span: 2, placeholder: 'e.g. HDFC Regalia, SBI Elite...' },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: `span ${f.span || 1}` }}>
                  <label style={{ fontSize: 10, color: '#5e5c72', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input
                    value={form[f.key]}
                    onChange={set(f.key)}
                    placeholder={f.placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}

              {/* Bank Select */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Bank / Issuer</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.bank} onChange={set('bank')} style={{ ...inputStyle, appearance: 'none', paddingRight: 36 }}>
                    <option value="">Select bank...</option>
                    {BANKS.map(b => <option key={b}>{b}</option>)}
                  </select>
                  <ChevronDown size={14} color="#5e5c72" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Tier */}
              <div>
                <label style={labelStyle}>Card Tier</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.tier} onChange={set('tier')} style={{ ...inputStyle, appearance: 'none', paddingRight: 32 }}>
                    <option value="">Select tier...</option>
                    {TIERS.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} color="#5e5c72" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Fee */}
              <div>
                <label style={labelStyle}>Annual Fee (₹)</label>
                <input type="number" value={form.fee} onChange={set('fee')} placeholder="e.g. 2500" style={inputStyle} />
              </div>

              {/* Network */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Network</label>
                <div style={{ position: 'relative' }}>
                  <select value={form.network} onChange={set('network')} style={{ ...inputStyle, appearance: 'none', paddingRight: 36 }}>
                    <option value="">Select network...</option>
                    {NETWORKS.map(n => <option key={n}>{n}</option>)}
                  </select>
                  <ChevronDown size={14} color="#5e5c72" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Features */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Key Features (optional)</label>
                <input value={form.features} onChange={set('features')} placeholder="e.g. lounge access, cashback, travel insurance..." style={inputStyle} />
              </div>
            </div>

            {/* BUTTONS */}
            <div style={{ display: 'flex', gap: 10, marginTop: '1.25rem' }}>
              <motion.button
                onClick={handleAnalyze}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? 'none' : '0 8px 30px rgba(79,142,247,0.4)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1, padding: '13px', borderRadius: 12, border: 'none',
                  background: loading ? 'rgba(79,142,247,0.3)' : 'linear-gradient(135deg, #4f8ef7, #7c5cfc)',
                  color: 'white', fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: 0.3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 20px rgba(79,142,247,0.25)',
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                    />
                    Analyzing...
                  </>
                ) : (
                  <><ScanLine size={16} /> Analyze My Card</>
                )}
              </motion.button>

              {result && (
                <motion.button
                  onClick={handleReset}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '13px 16px', borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
                    color: '#9d9bab', cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={16} />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* RIGHT — RESULTS */}
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: '#12141a', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 20, padding: '4rem 2rem', textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 52, marginBottom: '1rem', opacity: 0.2 }}>🔍</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 600, color: '#9d9bab', marginBottom: 8 }}>
                  No card analyzed yet
                </div>
                <div style={{ fontSize: 13, color: '#5e5c72', maxWidth: 280, margin: '0 auto', lineHeight: 1.6 }}>
                  Fill in your card details or upload an image, then click Analyze.
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                {/* AGENT STEPS */}
                {agentSteps.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{
                      background: 'rgba(34,211,165,0.04)',
                      border: '1px solid rgba(34,211,165,0.18)',
                      borderRadius: 16, padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 600, color: '#22d3a5' }}>
                      🤖 Agent Activity Log
                      {result?.isAgentResult && (
                        <span style={{ fontSize: 10, background: 'rgba(34,211,165,0.12)', border: '1px solid rgba(34,211,165,0.3)', borderRadius: 20, padding: '2px 8px', color: '#22d3a5', fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}>
                          LIVE AI
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {agentSteps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#9d9bab', lineHeight: 1.5 }}
                        >
                          <span style={{ color: '#22d3a5', flexShrink: 0, marginTop: 1 }}>→</span>
                          <span>{step}</span>
                        </motion.div>
                      ))}
                    </div>
                    {result?.dataSource && (
                      <div style={{ marginTop: 10, fontSize: 11, color: '#5e5c72', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                        📦 Data source: {result.dataSource}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* SCORE + STATS */}
                <div style={{
                  background: '#12141a', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 20, padding: '1.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <ScoreRing score={result.score} size={100} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: '#eeedf0', marginBottom: 4 }}>
                        {result.cardName}
                      </div>
                      <div style={{ fontSize: 12, color: '#9d9bab', lineHeight: 1.6 }}>
                        {result.bankName} · {result.score}/100 coverage score
                      </div>
                      {/* progress bar */}
                      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, height: 5, marginTop: 10, overflow: 'hidden', maxWidth: 220 }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.score}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                          style={{
                            height: '100%', borderRadius: 8,
                            background: result.score >= 70 ? 'linear-gradient(90deg,#22d3a5,#16a085)' : result.score >= 45 ? 'linear-gradient(90deg,#f7c15c,#e67e22)' : 'linear-gradient(90deg,#f75c5c,#c0392b)',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* STAT CARDS */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                    {[
                      { label: 'Included',  value: grouped.has.length,     color: '#22d3a5' },
                      { label: 'Partial',   value: grouped.partial.length,  color: '#f7c15c' },
                      { label: 'Missing',   value: grouped.not.length,      color: '#f75c5c' },
                    ].map(s => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: '#1a1d26', borderRadius: 12, padding: '12px',
                          textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: 10, color: '#5e5c72', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* AI INSIGHT */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(79,142,247,0.06), rgba(124,92,252,0.06))',
                    border: '1px solid rgba(79,142,247,0.18)',
                    borderRadius: 16, padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 600, color: '#4f8ef7' }}>
                    ✦ AI Insight
                  </div>
                  <p style={{ fontSize: 13, color: '#9d9bab', lineHeight: 1.7 }}>{result.summary}</p>
                </motion.div>

                {/* RADAR CHART */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    background: '#12141a', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 20, padding: '1.5rem',
                  }}
                >
                  <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#5e5c72', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    Coverage by Category
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                  </div>
                  <PolicyChart policies={result.policies} />
                </motion.div>

                {/* POLICY LIST */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    background: '#12141a', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 20, padding: '1.5rem',
                  }}
                >
                  <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#5e5c72', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    All Policies
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                  </div>

                  {/* TABS */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {[
                      { id: 'all',     label: `All (${ALL_POLICIES.length})` },
                      { id: 'has',     label: `✓ Included (${grouped.has.length})` },
                      { id: 'partial', label: `~ Partial (${grouped.partial.length})` },
                      { id: 'not',     label: `✗ Missing (${grouped.not.length})` },
                    ].map(t => (
                      <motion.button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '5px 13px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif', letterSpacing: 0.2,
                          border: activeTab === t.id ? '1px solid rgba(79,142,247,0.4)' : '1px solid rgba(255,255,255,0.07)',
                          background: activeTab === t.id ? 'rgba(79,142,247,0.12)' : 'transparent',
                          color: activeTab === t.id ? '#4f8ef7' : '#5e5c72',
                        }}
                      >
                        {t.label}
                      </motion.button>
                    ))}
                  </div>

                  {/* CATEGORY FILTER */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Filter size={13} color="#5e5c72" />
                    {CATEGORIES.map(c => (
                      <motion.button
                        key={c}
                        onClick={() => setActiveFilter(c)}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '4px 11px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                          cursor: 'pointer', fontFamily: 'Instrument Sans, sans-serif', letterSpacing: 0.5, textTransform: 'uppercase',
                          border: activeFilter === c ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.07)',
                          background: activeFilter === c ? 'rgba(201,168,76,0.1)' : 'transparent',
                          color: activeFilter === c ? '#c9a84c' : '#5e5c72',
                        }}
                      >
                        {c}
                      </motion.button>
                    ))}
                  </div>

                  {/* POLICY ITEMS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <AnimatePresence>
                      {shownPolicies.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{ textAlign: 'center', padding: '2rem', color: '#5e5c72', fontSize: 13 }}
                        >
                          No policies match this filter.
                        </motion.div>
                      ) : (
                        shownPolicies.map(({ policy, status }, i) => (
                          <PolicyItem key={policy.id + activeTab + activeFilter} policy={policy} status={status} index={i} />
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Instrument Sans', sans-serif; color: #eeedf0; overflow-x: hidden; }
        input, select, button { font-family: 'Instrument Sans', sans-serif; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </>
  );
}

const inputStyle = {
  background: '#1a1d26', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 10, padding: '10px 13px', color: '#eeedf0',
  fontSize: 13, width: '100%', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: 'Instrument Sans, sans-serif',
};

const labelStyle = {
  fontSize: 10, color: '#5e5c72', fontWeight: 600,
  letterSpacing: 0.5, textTransform: 'uppercase',
  display: 'block', marginBottom: 5,
};
