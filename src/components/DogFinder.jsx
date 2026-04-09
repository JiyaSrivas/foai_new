import React, { useState, useEffect } from 'react';
import { Dog, Copy, RefreshCw } from 'lucide-react';

const DogFinder = () => {
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDog = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      if (!response.ok) throw new Error('Failed to fetch dog');
      const data = await response.json();
      setDog(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDog();
  }, []);

  const getBreed = (url) => {
    if (!url) return '';
    // Format: https://images.dog.ceo/breeds/subbreed-breed/image.jpg
    const parts = url.split('/');
    const breedIndex = parts.indexOf('breeds');
    if (breedIndex !== -1 && parts[breedIndex + 1]) {
      const breed = parts[breedIndex + 1];
      return breed.split('-').reverse().join(' ').toUpperCase();
    }
    return 'Unknown Breed';
  };

  const copyUrl = () => {
    if (dog) {
      navigator.clipboard.writeText(dog);
      alert('URL copied to clipboard!');
    }
  };

  return (
    <div className="card glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Dog size={24} color="#a855f7" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Dog Finder</h2>
      </div>

      <div style={{ height: '300px', width: '100%', marginBottom: '1rem', overflow: 'hidden', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
        {loading ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : dog ? (
          <img src={dog} alt="A random dog" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--muted-foreground))' }}>
            {error || 'No image loaded'}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}>BREED</p>
        <p style={{ fontSize: '1.125rem', fontWeight: '700', letterSpacing: '0.05em' }}>
          {dog ? getBreed(dog) : '...'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={fetchDog} disabled={loading} style={{ flex: 1 }}>
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
          Get Dog
        </button>
        <button onClick={copyUrl} disabled={!dog} className="secondary">
          <Copy size={18} />
        </button>
      </div>
    </div>
  );
};

export default DogFinder;
