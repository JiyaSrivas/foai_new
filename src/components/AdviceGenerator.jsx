import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';

const AdviceGenerator = () => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      // adviceslip.com often caches, adding a timestamp to bypass
      const response = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
      if (!response.ok) throw new Error('Failed to fetch advice');
      const data = await response.json();
      setAdvice(data.slip.advice);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className="card glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Lightbulb size={24} color="#fbbf24" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Daily Wisdom</h2>
      </div>

      <div style={{ minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <p style={{ fontSize: '1.25rem', fontWeight: '500', lineHeight: '1.6', color: 'hsl(var(--foreground))' }}>
            "{advice}"
          </p>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={fetchAdvice} disabled={loading} style={{ width: '100%' }}>
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
          Get Advice
        </button>
      </div>
    </div>
  );
};

export default AdviceGenerator;
