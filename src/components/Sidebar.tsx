'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, ChevronDown, Cpu, Sparkles } from 'lucide-react';

interface SidebarProps {
  conversations: Array<{ id: string; title: string; model: string }>;
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const MODELS = [
  'anthropic/claude-opus-4.6',
  'anthropic/claude-sonnet-4-20250514',
  'zhipuai/glm-4-plus',
  'qwen/qwen3.6-plus:free',
];

export default function Sidebar({ conversations, activeId, onSelect, onNew, onDelete, selectedModel, onModelChange }: SidebarProps) {
  const [showModels, setShowModels] = useState(false);

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: 260 }}
      className="h-full border-r border-dark-border/30 bg-dark-card/95 backdrop-blur flex flex-col overflow-hidden flex-shrink-0"
    >
      {/* Header */}
      <div className="p-4 border-b border-dark-border/30">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-bold neon-text">VOIDGLYPH</span>
          <span className="text-gray-600">//</span>
          <span className="text-sm font-semibold neon-text-pink">HERMES</span>
        </div>
      </div>

      {/* New Conversation */}
      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full px-3 py-2.5 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green
                     hover:bg-neon-green/20 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          <span>Nouvelle Conversation</span>
        </button>
      </div>

      {/* Model selector */}
      <div className="px-3 mb-2">
        <button
          onClick={() => setShowModels(!showModels)}
          className="w-full px-3 py-2 rounded-lg bg-dark-hover border border-dark-border text-xs text-gray-300
                     hover:border-neon-blue/40 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-neon-blue" />
            <span className="truncate">{selectedModel.split('/').pop()}</span>
          </div>
          <ChevronDown size={12} className={`transition-transform ${showModels ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showModels && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-1">
                {MODELS.map(m => (
                  <button
                    key={m}
                    onClick={() => { onModelChange(m); setShowModels(false); }}
                    className={`w-full px-3 py-1.5 rounded-md text-xs text-left transition-all
                      ${m === selectedModel
                        ? 'bg-neon-blue/15 text-neon-blue border border-neon-blue/30'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-dark-hover'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {conversations.length === 0 && (
          <div className="px-3 py-4 text-center text-xs text-gray-600">
            Aucune conversation
          </div>
        )}
        {conversations.map(c => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`group px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 flex items-center gap-2
              ${c.id === activeId
                ? 'bg-neon-green/10 border border-neon-green/20 text-neon-green'
                : 'text-gray-400 hover:bg-dark-hover hover:text-gray-200'}`}
          >
            <MessageSquare size={14} className="flex-shrink-0" />
            <span className="truncate text-xs flex-1">{c.title}</span>
            <button
              onClick={e => { e.stopPropagation(); onDelete(c.id); }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-neon-pink transition-opacity"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Bottom branding */}
      <div className="p-3 border-t border-dark-border/30">
        <div className="flex items-center justify-center gap-1 text-[10px] text-gray-600">
          <Sparkles size={10} className="text-neon-pink" />
          <span>VOIDGLYPH</span>
          <span className="text-neon-green">//</span>
          <span>HERMES</span>
        </div>
      </div>
    </motion.aside>
  );
}
