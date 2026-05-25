import React, { useState } from 'react';

export default function ChatPane({ conversationId, chatHistory, setChatHistory, onSchemaUpdate }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', content: prompt };
    setChatHistory(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/form/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.content, conversationId })
      });
      const data = await res.json();

      if (data.status === 'clarification_needed') {
        const assistantMessage = { role: 'assistant', content: data.questions.join('\n') };
        setChatHistory(prev => [...prev, assistantMessage]);
        if (data.conversationId) {
          onSchemaUpdate(null, 0, data.conversationId);
        }
      } else if (data.schema) {
        const assistantMessage = { role: 'assistant', content: 'Form generated successfully.' };
        setChatHistory(prev => [...prev, assistantMessage]);
        onSchemaUpdate(data.schema, data.version, data.conversationId);
      } else {
        const errorMessage = { role: 'assistant', content: data.error || 'Failed to generate form.' };
        setChatHistory(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Network error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="chat-history">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{msg.content}</pre>
          </div>
        ))}
        {loading && <div className="message assistant">Generating...</div>}
      </div>
      <form className="chat-input-area" onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={prompt} 
          onChange={e => setPrompt(e.target.value)} 
          placeholder="Ask me to build a form..." 
          disabled={loading}
        />
        <button type="submit" disabled={loading || !prompt.trim()}>Send</button>
      </form>
    </>
  );
}
