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
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.8, opacity: 0 }}
             className="bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-white/10 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Choose Player to Swap Hands</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {players.map(p => (
                <button
                  key={p.id}
                  onClick={() => onPlayerChosen(p.id)}
                  className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg flex justify-between items-center transition"
                >
                  <span className="font-bold">{p.name}</span>
                  <span className="text-sm text-neutral-400">{p.hand.length} Cards</span>
                </button>
              ))}
            </div>
            <button 
               onClick={onCancel}
               className="mt-6 w-full py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-bold transition-colors"
            >
               Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
