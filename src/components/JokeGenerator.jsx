import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

const JokeGenerator = () => {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    setRevealed(false);
    try {
      const response = await fetch('https://official-joke-api.appspot.com/random_joke');
      if (!response.ok) throw new Error('Failed to fetch joke');
      const data = await response.json();
      setJoke(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div className="card glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Quote size={24} color="#6366f1" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Joke Generator</h2>
      </div>

      <div style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : joke ? (
          <>
            <p style={{ fontSize: '1.25rem', fontWeight: '500', fontStyle: 'italic', color: 'hsl(var(--foreground))' }}>
              "{joke.setup}"
            </p>
            
            <div style={{ transition: 'all 0.5s ease', opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(10px)' }}>
              <p style={{ fontSize: '1.125rem', fontWeight: '700', color: 'hsl(var(--primary))' }}>
                — {joke.punchline}
              </p>
            </div>

            {!revealed && (
              <button className="secondary" onClick={() => setRevealed(true)} style={{ alignSelf: 'flex-start' }}>
                Reveal Punchline
              </button>
            )}
          </>
        ) : null}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={fetchJoke} disabled={loading} style={{ width: '100%' }}>
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
          Next Joke
        </button>
      </div>
    </div>
  );
};

export default JokeGenerator;
