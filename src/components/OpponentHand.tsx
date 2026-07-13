import { motion, AnimatePresence } from 'motion/react';
import CardBack from './CardBack.tsx';

export default function OpponentHand({ count }: { count: number }) {
  const displayCount = Math.min(count, 13);
  const spread = Math.min(100, displayCount * 10);
  const startAngle = -spread / 2;
  const step = displayCount > 1 ? spread / (displayCount - 1) : 0;
  
  return (
    <div className="relative w-24 h-32 flex justify-center pointer-events-none mt-4">
      <AnimatePresence>
        {Array.from({ length: displayCount }).map((_, i) => (
           <motion.div 
             key={i} 
             className="absolute origin-bottom top-4 drop-shadow-md"
             initial={{ opacity: 0, scale: 0.5, y: -20 }}
             animate={{ 
               opacity: 1, 
               scale: 1, 
               y: 0,
               rotate: startAngle + step * i,
               x: (i - displayCount/2) * 1.5
             }}
             exit={{ opacity: 0, scale: 0.5, y: -20 }}
             transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.05 }}
             style={{ zIndex: i }}
           >
             <CardBack size="sm" />
           </motion.div>
        ))}
      </AnimatePresence>
      <div className="absolute bottom-0 bg-black/90 px-3 py-1 rounded text-white text-xs font-black z-50 shadow-xl border border-white/10">
         {count}
      </div>
    </div>
  );
}
