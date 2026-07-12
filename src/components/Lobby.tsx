import { useState } from 'react';
import type { FormEvent } from 'react';
import { GameMode } from '../types.ts';

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
    <div className="flex-1 flex items-center justify-center bg-[#0a0a0c] p-4">
      <div className="bg-[#141418] p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/10">
        <h1 className="text-4xl font-black text-center mb-8 tracking-tighter italic text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          SCUFFED<span className="text-red-500">UNO</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Your Name</label>
            <input
              type="text"
              required
              maxLength={12}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Player123"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Room Code</label>
            <input
              type="text"
              required
              maxLength={10}
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 uppercase"
              placeholder="ROOM1"
            />
          </div>

          

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-sm italic tracking-tighter rounded-md shadow-lg shadow-red-600/20 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all mt-4"
          >
            JOIN / CREATE ROOM
          </button>
        </form>
      </div>
    </div>
  );
}
