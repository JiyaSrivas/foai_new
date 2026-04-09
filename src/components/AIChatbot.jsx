import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ImageIcon, Download } from 'lucide-react';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use OpenRouter or fall back to a mock if no key is provided
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_OPENROUTER_KEY') {
        throw new Error('OpenRouter API Key not configured. Please add it to your .env file.');
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'API Playground'
        },
        body: JSON.stringify({
          model: 'openchat/openchat-7b:free',
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) throw new Error('Failed to get response from AI');
      const data = await response.json();
      const botMessage = { role: 'assistant', content: data.choices[0].message.content };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!input.trim() || isGeneratingImage) {
        if (!input.trim()) alert('Please enter a prompt in the message box to generate an image.');
        return;
    }

    const prompt = input;
    const userMessage = { role: 'user', content: `Generate an image of: ${prompt}`, isAction: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGeneratingImage(true);

    try {
      const hfToken = import.meta.env.VITE_HF_TOKEN;
      if (!hfToken || hfToken === 'YOUR_HF_TOKEN') {
        throw new Error('Hugging Face Token not configured. Please add it to your .env file.');
      }

      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) throw new Error('Failed to generate image');
      
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Here is your generated image:', 
        image: imageUrl 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Image Generation Error: ${err.message}` }]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="card glass" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexShrink: 0 }}>
        <Bot size={24} color="#ec4899" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>AI Assistant</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', backgroundColor: m.role === 'user' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div style={{ 
              maxWidth: '80%', padding: '0.75rem 1rem', borderRadius: '12px',
              backgroundColor: m.role === 'user' ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.05)',
              color: 'white', fontSize: '0.9rem'
            }}>
              {m.content}
              {m.image && (
                <div style={{ marginTop: '0.75rem' }}>
                  <img src={m.image} alt="Generated" style={{ width: '100%', borderRadius: '8px' }} />
                  <a href={m.image} download="generated-image.png" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', marginTop: '0.5rem', color: 'hsl(var(--muted-foreground))', textDecoration: 'none' }}>
                    <Download size={14} /> Download Image
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'hsl(var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} />
            </div>
            <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <Loader2 size={16} className="spin" />
            </div>
          </div>
        )}
        {isGeneratingImage && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'hsl(var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} />
            </div>
            <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Loader2 size={16} className="spin" />
              <span>Generating masterpiece...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message or image prompt..."
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={isLoading || isGeneratingImage}>
          <Send size={18} />
        </button>
        <button type="button" onClick={handleGenerateImage} disabled={isLoading || isGeneratingImage} className="secondary" title="Generate Image from Text">
          <ImageIcon size={18} />
        </button>
      </form>
    </div>
  );
};

export default AIChatbot;
