import { useState } from 'react';
import { getDemoData, ALL_POLICIES } from '../data/policies';

export function useAnalyze() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [agentSteps, setAgentSteps] = useState([]);

  async function analyze({ bank, cardName, tier, fee, network, features, imageData }) {
    setLoading(true);
    setError(null);
    setAgentSteps([]);

    try {
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank, cardName, tier, fee, network, features, imageData }),
      });

      const data = await resp.json();

      if (data.success && data.result) {
        setResult(data.result);
        setAgentSteps(data.result.agentSteps || []);
      } else {
        throw new Error(data.error || 'Agent failed');
      }
    } catch (err) {
      console.warn('Falling back to demo data:', err.message);
      const demo = getDemoData(bank, cardName, tier, fee);
      demo.isAgentResult = false;
      setResult(demo);
      setAgentSteps(['⚠️ Agent unavailable — showing estimated results']);
      setError('demo');
    } finally {
      setLoading(false);
    }
  }

  return {
    analyze,
    loading,
    result,
    error,
    agentSteps,
    reset: () => { setResult(null); setAgentSteps([]); setError(null); },
  };
}
