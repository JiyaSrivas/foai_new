import React, { useState, useEffect } from 'react';
import { User, Mail, Globe, Phone, Calendar, RefreshCw } from 'lucide-react';

const UserRandomizer = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://randomuser.me/api/');
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      setUser(data.results[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="card glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <User size={24} color="#10b981" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Random User Profiler</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: '300px' }}>
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : user ? (
          <>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid hsl(var(--primary))', marginBottom: '1rem' }}>
              <img src={user.picture.large} alt={user.name.first} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {user.name.title} {user.name.first} {user.name.last}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', width: '100%', marginTop: '1rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <Mail size={16} color="hsl(var(--muted-foreground))" />
                <span style={{ color: 'hsl(var(--foreground))' }}>{user.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <Globe size={16} color="hsl(var(--muted-foreground))" />
                <span>{user.location.country}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <Calendar size={16} color="hsl(var(--muted-foreground))" />
                <span>Age: {user.dob.age} years</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <Phone size={16} color="hsl(var(--muted-foreground))" />
                <span>{user.phone}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="error-message">{error}</p>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={fetchUser} disabled={loading} style={{ width: '100%' }}>
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
          Get New User
        </button>
      </div>
    </div>
  );
};

export default UserRandomizer;
