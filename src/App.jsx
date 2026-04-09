import React, { useState } from 'react';
import DogFinder from './components/DogFinder';
import JokeGenerator from './components/JokeGenerator';
import UserRandomizer from './components/UserRandomizer';
import AdviceGenerator from './components/AdviceGenerator';
import WeatherFinder from './components/WeatherFinder';
import IPGeolocator from './components/IPGeolocator';
import AIChatbot from './components/AIChatbot';
import { LayoutDashboard, MessageSquare } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('api');

  return (
    <div className="layout">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Public API Playground</h1>
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>Explore powerful public APIs and AI Assistant</p>
        
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '12px', marginTop: '2rem' }}>
          <button 
            className={activeTab === 'api' ? '' : 'secondary'} 
            onClick={() => setActiveTab('api')}
            style={{ borderRadius: '8px' }}
          >
            <LayoutDashboard size={18} />
            API Explorer
          </button>
          <button 
            className={activeTab === 'chat' ? '' : 'secondary'} 
            onClick={() => setActiveTab('chat')}
            style={{ borderRadius: '8px', marginLeft: '0.4rem' }}
          >
            <MessageSquare size={18} />
            AI Chatbot
          </button>
        </div>
      </header>

      <main>
        {activeTab === 'api' ? (
          <div className="grid">
            <DogFinder />
            <JokeGenerator />
            <UserRandomizer />
            <AdviceGenerator />
            <WeatherFinder />
            <IPGeolocator />
          </div>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <AIChatbot />
          </div>
        )}
      </main>

      <footer style={{ marginTop: '5rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
        <p>© 2026 API Playground - Lab 7 Activity</p>
      </footer>
    </div>
  );
}

export default App;
