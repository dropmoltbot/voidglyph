import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 px-4 py-3"
    >
      <div className="w-8 h-8 rounded-lg bg-neon-green/20 border border-neon-green/30 flex items-center justify-center">
        <span className="text-neon-green text-xs">∞</span>
      </div>
      <div className="flex items-center gap-1.5 pt-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full bg-neon-green"
          />
        ))}
      </div>
    </motion.div>
  );
}
