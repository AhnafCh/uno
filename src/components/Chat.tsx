import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { GameState } from '../types.ts';
import { socket } from '../socket.ts';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  gameState: GameState;
  socketId: string;
}

export default function Chat({ gameState, socketId }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isOpen && gameState.chat.length > 0) {
      setUnread(prev => prev + 1);
    }
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnread(0);
    }
  }, [gameState.chat.length, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat_message', { roomId: gameState.id, message: message.trim() });
      setMessage('');
    }
  };

  return (
    <div className="absolute bottom-[200px] left-6 z-40 flex flex-col items-start">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="chat-icon"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shadow-2xl relative group cursor-pointer outline-none"
          >
            <MessageSquare size={20} className="text-white/70 group-hover:text-white" />
            {unread > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></span>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-72 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg flex flex-col overflow-hidden shadow-2xl"
          >
            <div 
               onClick={() => setIsOpen(false)}
               className="p-2 border-b border-white/5 text-[9px] font-bold tracking-widest text-white/30 uppercase flex justify-between items-center cursor-pointer hover:bg-white/5 transition"
            >
              <span>System Logs</span>
              <X size={14} className="opacity-50 hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="h-[160px] flex flex-col">
              <div className="flex-1 p-2 space-y-1.5 overflow-y-auto text-[11px] custom-scrollbar">
                {gameState.chat.length === 0 ? (
                  <div className="text-white/30 italic text-center mt-2">No messages yet.</div>
                ) : (
                  gameState.chat.map(msg => {
                     const isMe = msg.senderName === gameState.players.find(p => p.id === socketId)?.name;
                     return (
                      <div key={msg.id} className={`${isMe ? 'text-blue-400' : 'text-white/80'}`}>
                        <span className="font-bold opacity-70">[{msg.senderName}]:</span> {msg.message}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSubmit} className="p-2 border-t border-white/5">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Press Enter to chat..."
                  className="w-full bg-white/5 px-2 py-1.5 rounded border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
