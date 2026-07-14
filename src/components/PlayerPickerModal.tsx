import { motion, AnimatePresence } from 'motion/react';
import { Player } from '../types.ts';

interface Props {
  show: boolean;
  players: Player[];
  onPlayerChosen: (playerId: string) => void;
  onCancel: () => void;
}

export default function PlayerPickerModal({ show, players, onPlayerChosen, onCancel }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <motion.div 
             initial={{ scale: 0.8, opacity: 0, y: 20 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.8, opacity: 0, y: 20 }}
             transition={{ type: "spring", stiffness: 300, damping: 25 }}
             className="bg-[#0a0a0c] p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 max-w-md w-full mx-4"
          >
            <h3 className="text-2xl font-black mb-6 text-center uppercase tracking-widest text-white/90">Swap Hands</h3>
            <p className="text-white/50 text-center text-sm mb-6">Choose a player to swap your hand with.</p>
            <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
              {players.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onPlayerChosen(p.id)}
                  className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex justify-between items-center transition-colors group border border-white/5 hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex flex-col items-center justify-center text-xs font-black shadow-inner border border-white/10 group-hover:border-red-500/50 transition-colors">
                       <span>{p.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <span className="font-bold text-white/90">{p.name}</span>
                  </div>
                  <span className="text-sm font-bold px-3 py-1 bg-black/50 rounded-full text-white/70">{p.hand.length} Cards</span>
                </motion.button>
              ))}
            </div>
            <button 
               onClick={onCancel}
               className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-2xl font-bold transition-colors uppercase tracking-widest text-sm"
            >
               Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
