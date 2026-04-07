"use client";
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Square } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  onStop: () => void;
  isStreaming: boolean;
}

export default function ChatInput({ onSend, disabled, onStop, isStreaming }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [text]);

  const handleSubmit = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2 bg-dark-bg/90 backdrop-blur border-t border-dark-border/30">
      <div className="max-w-3xl mx-auto relative">
        <div className="flex items-end gap-2 bg-dark-input border border-dark-border focus-within:border-neon-green/50 
                         rounded-2xl px-4 py-3 transition-all duration-200 
                         focus-within:shadow-[0_0_15px_rgba(0,255,157,0.1)]">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Parle à Hermes..."
            rows={1}
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 resize-none outline-none text-sm max-h-[200px]"
          />
          {isStreaming ? (
            <button
              onClick={onStop}
              className="p-2 rounded-xl bg-neon-pink/20 border border-neon-pink/30 text-neon-pink 
                         hover:bg-neon-pink/30 transition-all flex-shrink-0"
            >
              <Square size={16} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={disabled || !text.trim()}
              className="p-2 rounded-xl bg-neon-green/20 border border-neon-green/30 text-neon-green 
                         hover:bg-neon-green/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              <Loader2 size={16} className={disabled ? 'animate-spin' : ''} />
              {!disabled && <Send size={16} className="-ml-4" />}
            </button>
          )}
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-gray-600">
            <span className="text-neon-pink">♥</span> VOIDGLYPH // powered by Hermes Agent
          </span>
        </div>
      </div>
    </div>
  );
}
