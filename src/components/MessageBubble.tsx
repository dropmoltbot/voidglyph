'use client';
import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bot, Sparkles, Copy, Check } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export default function MessageBubble({ content, role, timestamp }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function formatContent(text: string) {
    const lines = text.split('\n');
    const result: React.ReactElement[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLang = '';

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          result.push(
            <pre key={result.length} className="bg-dark-bg/80 border border-dark-border rounded-lg p-3 my-2 text-xs overflow-x-auto text-neon-green font-mono">
              <code>{codeLines.join('\n')}</code>
            </pre>
          );
          inCodeBlock = false;
          codeLines = [];
          codeLang = '';
        } else {
          inCodeBlock = true;
          codeLang = line.slice(3);
        }
        continue;
      }
      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }
      // Parse inline markdown
      const parts: React.ReactElement[] = [];
      const regex = /`([^`]+)`|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_/g;
      let lastIndex = 0;
      let match;
      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(<span key={lastIndex}>{line.slice(lastIndex, match.index)}</span>);
        }
        if (match[1]) {
          parts.push(<code key={match.index} className="px-1.5 py-0.5 rounded bg-dark-hover text-neon-blue text-xs font-mono">{match[1]}</code>);
        } else if (match[2]) {
          parts.push(<strong key={match.index}>{match[2]}</strong>);
        } else if (match[4] || match[5]) {
          parts.push(<em key={match.index}>{match[4] || match[5]}</em>);
        }
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) {
        parts.push(<span key={lastIndex}>{line.slice(lastIndex)}</span>);
      }
      result.push(<p key={`line-${result.length}`} className="mb-1 last:mb-0">{parts.length > 0 ? parts : <span>&nbsp;</span>}</p>);
    }
    return result;
  }

  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 px-4 py-3 group`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1
        ${isUser 
          ? 'bg-neon-pink/20 border border-neon-pink/30' 
          : 'bg-neon-green/20 border border-neon-green/30'}`}>
        {isUser ? <User size={16} className="text-neon-pink" /> : <Bot size={16} className="text-neon-green" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-semibold ${isUser ? 'text-neon-pink' : 'text-neon-green'}`}>
            {isUser ? 'dropxtor' : 'hermes'}
          </span>
          {!isUser && <Sparkles size={10} className="text-neon-yellow" />}
          <span className="text-[10px] text-gray-600">
            {new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={copyToClipboard}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-neon-blue transition-opacity ml-auto"
          >
            {copied ? <Check size={12} className="text-neon-green" /> : <Copy size={12} />}
          </button>
        </div>
        <div className="text-sm leading-relaxed text-gray-200 break-words">
          {formatContent(content)}
        </div>
      </div>
    </motion.div>
  );
}
