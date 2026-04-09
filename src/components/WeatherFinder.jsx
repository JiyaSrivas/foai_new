import React, { useState } from 'react';
import { CloudSun, Search, Wind, Droplets, Thermometer } from 'lucide-react';

const WeatherFinder = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (e) => {
    if (e) e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    try {
      // 1. Get coordinates for city
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found');
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Get weather
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const weatherData = await weatherRes.json();

      setWeather({
        name,
        country,
        temp: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        code: weatherData.current_weather.weathercode
      });
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <CloudSun size={24} color="#3b82f6" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Weather Finder</h2>
      </div>

      <form onSubmit={fetchWeather} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input 
          placeholder="Enter city (e.g. London)" 
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" disabled={loading} style={{ padding: '0.625rem' }}>
          {loading ? <div className="loading-spinner" style={{ width: '1rem', height: '1rem' }}></div> : <Search size={18} />}
        </button>
      </form>

      <div style={{ minHeight: '150px' }}>
        {error && <p className="error-message">{error}</p>}
        {weather && (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{weather.name}, {weather.country}</h3>
            <div style={{ fontSize: '3rem', fontWeight: '800', margin: '0.5rem 0', color: 'hsl(var(--primary))' }}>
              {weather.temp}°C
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Wind size={16} /> {weather.wind} km/h
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Thermometer size={16} /> Code: {weather.code}
              </div>
            </div>
          </div>
        )}
        {!weather && !loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '150px', color: 'hsl(var(--muted-foreground))' }}>
            <CloudSun size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>Search for a city to see weather</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherFinder;
