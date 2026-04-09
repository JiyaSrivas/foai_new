import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Server, Shield, RefreshCw } from 'lucide-react';

const IPGeolocator = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIPInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Failed to fetch IP info');
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPInfo();
  }, []);

  return (
    <div className="card glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <MapPin size={24} color="#f43f5e" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>IP Geolocator</h2>
      </div>

      <div style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : data ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Globe size={16} color="hsl(var(--primary))" />
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>IP ADDRESS</span>
              </div>
              <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{data.ip}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}>LOCATION</p>
                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{data.city}, {data.region_code}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}>COUNTRY</p>
                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{data.country_name}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}>ISP</p>
                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{data.org}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}>TIMEZONE</p>
                <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{data.timezone}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={fetchIPInfo} disabled={loading} style={{ width: '100%' }}>
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
          Refresh My IP
        </button>
      </div>
    </div>
  );
};

export default IPGeolocator;
