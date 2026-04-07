'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import MatrixBackground from '@/components/MatrixBackground';
import Sidebar from '@/components/Sidebar';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: number;
}

const API_KEY = '09c817ebb7ab494dff88ab1d79dd439d09d9a7db19b31966f6560f101ebbab83';

export default function Page() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-opus-4.6');
  const [streaming, setStreaming] = useState(false);
  const [abortCtrl, setAbortCtrl] = useState<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConv = conversations.find(c => c.id === activeId);

  useEffect(() => {
    const saved = localStorage.getItem('witcher-conversations');
    if (saved) {
      try { setConversations(JSON.parse(saved)); } catch {}
    }
    const savedModel = localStorage.getItem('witcher-model');
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  useEffect(() => {
    if (conversations.length) localStorage.setItem('witcher-conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('witcher-model', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages?.length, activeConv?.messages?.[activeConv?.messages?.length - 1]?.content]);

  const newConversation = useCallback(() => {
    const id = crypto.randomUUID();
    const conv: Conversation = {
      id, title: 'Nouvelle conversation', messages: [], model: selectedModel, createdAt: Date.now()
    };
    setConversations(prev => [conv, ...prev]);
    setActiveId(id);
  }, [selectedModel]);

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const sendMessage = async (text: string) => {
    let convId = activeId;
    if (!convId) {
      const id = crypto.randomUUID();
      const newConv: Conversation = {
        id, title: text.slice(0, 40), messages: [], model: selectedModel, createdAt: Date.now()
      };
      setConversations(prev => [newConv, ...prev]);
      convId = id;
      setActiveId(id);
    }

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now() };

    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        const updated = { ...c, messages: [...c.messages, userMsg] };
        return { ...updated, title: c.messages.length === 0 ? text.slice(0, 40) : c.title };
      }
      return c;
    }));

    setStreaming(true);
    const ctrl = new AbortController();
    setAbortCtrl(ctrl);

    const currentConv = conversations.find(c => c.id === convId);
    const history = currentConv ? currentConv.messages : [];
    const apiMessages = [
      { role: 'system' as const, content: 'You are Hermes, a helpful AI assistant.' },
      ...history,
      { role: 'user' as const, content: text }
    ];

    let assistantContent = '';
    const assistantId = crypto.randomUUID();

    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          messages: [...c.messages, { id: assistantId, role: 'assistant' as const, content: '', timestamp: Date.now() }]
        };
      }
      return c;
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ model: selectedModel, messages: apiMessages }),
        signal: ctrl.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.slice(0, 6);
          if (trimmed === 'data: [DONE]') continue;
          if (trimmed !== 'data: ') continue;

          try {
            const json = JSON.parse(line.slice(6));
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setConversations(prev => prev.map(c => {
                if (c.id === convId) {
                  return {
                    ...c,
                    messages: c.messages.map(m =>
                      m.id === assistantId ? { ...m, content: assistantContent } : m
                    ),
                  };
                }
                return c;
              }));
            }
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.log('Stream aborted');
      } else {
        setConversations(prev => prev.map(c => {
          if (c.id === convId) {
            return {
              ...c,
              messages: c.messages.map(m =>
                m.id === assistantId
                  ? { ...m, content: `⚠ Error: ${e.message}` }
                  : m
              ),
            };
          }
          return c;
        }));
      }
    } finally {
      setStreaming(false);
      setAbortCtrl(null);
    }
  };

  const handleStop = () => {
    abortCtrl?.abort();
  };

  return (
    <div className="h-screen w-screen flex bg-dark-bg relative overflow-hidden">
      <MatrixBackground />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-30" style={{ backgroundColor: '#00ff9d33' }} />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-30" style={{ backgroundColor: '#ff007f33' }} />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: '#00f7ff33' }} />
      </div>
      
      <Sidebar
        conversations={conversations.map(c => ({ id: c.id, title: c.title, model: c.model }))}
        activeId={activeId || ''}
        onSelect={setActiveId}
        onNew={newConversation}
        onDelete={deleteConversation}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {!activeConv || activeConv.messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold">
                <span className="neon-text">VOIDGLYPH</span>{' '}
                <span className="text-gray-600">//</span>{' '}
                <span className="neon-text-pink">HERMES</span>
              </div>
              <div className="text-sm text-gray-500">Neural Interface v∞</div>
              <div className="flex items-center justify-center gap-3 mt-6">
                <span className="kawaii-badge">∞ powered by love</span>
                <span className="kawaii-badge">cyber mode</span>
                <span className="kawaii-badge">model: {selectedModel.split('/').pop()}</span>
              </div>

              <div className="mt-8 max-w-md mx-auto">
                <p className="text-gray-400 text-sm">
                  Start typing a message below. Hermes handles it with full tool access
                  — terminal, files, web, memory, and skills.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-1">
            {activeConv.messages.map(msg => (
              <MessageBubble
                key={msg.id}
                content={msg.content}
                role={msg.role === 'assistant' ? 'assistant' : 'user'}
                timestamp={msg.timestamp}
              />
            ))}
            {streaming && activeConv.messages[activeConv.messages.length - 1]?.content === '' && (
              <TypingIndicator />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        <ChatInput
          onSend={sendMessage}
          disabled={streaming}
          onStop={handleStop}
          isStreaming={streaming}
        />
      </div>
    </div>
  );
}
