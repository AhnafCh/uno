import { useState } from 'react';
import type { FormEvent } from 'react';
import { GameMode } from '../types.ts';
import { motion } from 'motion/react';
import PlayingCard from './PlayingCard.tsx';

interface Props {
  onJoin: (roomId: string, name: string, mode: GameMode) => void;
}

export default function Lobby({ onJoin }: Props) {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState<GameMode>('normal');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim() && roomId.trim()) {
      onJoin(roomId.trim(), name.trim(), mode);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Cards */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] top-[20%] opacity-40 blur-[2px] -z-10 scale-75"
      >
        <PlayingCard card={{ id: '1', color: 'red', value: 'draw2' }} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-[10%] bottom-[20%] opacity-30 blur-[4px] -z-10 scale-50"
      >
        <PlayingCard card={{ id: '2', color: 'wild', value: 'draw4' }} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }} 
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute left-[20%] bottom-[15%] opacity-40 blur-[3px] -z-10 scale-75"
      >
        <PlayingCard card={{ id: '3', color: 'blue', value: 'reverse' }} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, 15, 0] }} 
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute right-[15%] top-[15%] opacity-30 blur-[2px] -z-10 scale-75"
      >
        <PlayingCard card={{ id: '4', color: 'yellow', value: 'skip' }} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full max-w-md border border-white/10 relative z-10"
      >
        <h1 className="text-5xl font-black text-center mb-10 tracking-tighter italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          UNO<span className="text-red-500">WILD</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2 uppercase tracking-widest">Your Name</label>
            <input
              type="text"
              required
              maxLength={12}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white/10 transition-all font-medium placeholder-white/20"
              placeholder="Player123"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2 uppercase tracking-widest">Room Code</label>
            <input
              type="text"
              required
              maxLength={10}
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 uppercase focus:bg-white/10 transition-all font-medium placeholder-white/20 uppercase"
              placeholder="ROOM1"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98, y: 2 }}
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-lg italic tracking-widest rounded-xl shadow-[0_4px_20px_rgba(220,38,38,0.4)] border border-red-400/20 transition-all mt-8"
          >
            JOIN / CREATE
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
