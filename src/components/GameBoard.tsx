import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useAudio } from '../useAudio';
import { GameState, Card, CardColor, getDrawValue } from '../types.ts';
import { getColorHex } from '../utils.ts';
import { socket } from '../socket.ts';
import PlayingCard from './PlayingCard.tsx';
import Chat from './Chat.tsx';
import { Users, LogOut, Info } from 'lucide-react';
import CardBack from './CardBack.tsx';
import OpponentHand from './OpponentHand.tsx';
import ColorPickerModal from './ColorPickerModal.tsx';
import PlayerPickerModal from './PlayerPickerModal.tsx';

interface Props {
  gameState: GameState;
  socketId: string;
}

export default function GameBoard({ gameState, socketId }: Props) {
  const [showColorPicker, setShowColorPicker] = useState<{ cardId: string } | null>(null);
    const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [now, setNow] = useState(Date.now());
  const chatRef = useRef<HTMLDivElement>(null);
  
  const sendChat = (msg: string) => {
      if (!msg.trim()) return;
      socket.emit('chat_message', { roomId: gameState.id, message: msg });
      setChatMsg("");
  };

  
  useEffect(() => {
    let animationFrameId: number;
    const updateTime = () => {
      setNow(Date.now());
      animationFrameId = requestAnimationFrame(updateTime);
    };
    if (gameState.jumpInExpiry && gameState.jumpInExpiry > Date.now()) {
      updateTime();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState.jumpInExpiry]);

  useEffect(() => {
     if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
     }
  }, [gameState.chat?.length]);

  const [showPlayerPicker, setShowPlayerPicker] = useState<{ cardId: string, chosenColor?: CardColor } | null>(null);
  
  const myPlayerIndex = gameState.players.findIndex(p => p.id === socketId);
  const myPlayer = gameState.players[myPlayerIndex];

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
     if (gameState.status !== 'playing' || !gameState.turnTimeLimit || !gameState.turnStartTime) {
         setTimeLeft(null);
         return;
     }
     
     const interval = setInterval(() => {
         const elapsed = (Date.now() - gameState.turnStartTime!) / 1000;
         const remaining = Math.max(0, gameState.turnTimeLimit! - Math.floor(elapsed));
         setTimeLeft(remaining);
     }, 500);
     return () => clearInterval(interval);
  }, [gameState.status, gameState.turnTimeLimit, gameState.turnStartTime]);
  const { playSound } = useAudio();
  const handleUpdateSettings = (updates: any) => {
    socket.emit('update_settings', {
      roomId: gameState.id,
      limit: gameState.eliminationLimit || 0,
      winLimit: gameState.winLimit || 1,
      jumpIn: gameState.jumpInEnabled || false,
      mode: gameState.mode,
      rule70Enabled: gameState.rule70Enabled || false,
      forcePlayEnabled: gameState.forcePlayEnabled || false,
      botSpeed: gameState.botSpeed || 1500,
      turnTimeLimit: gameState.turnTimeLimit || 0,
      stackingEnabled: gameState.stackingEnabled || false,
      ...updates
    });
  };

  const prevDiscardLength = useRef(gameState.discardPile?.length || 0);
  const prevHandLength = useRef(0);
  
  useEffect(() => {
     if (gameState.discardPile && gameState.discardPile.length > prevDiscardLength.current) {
         playSound('play');
     }
     prevDiscardLength.current = gameState.discardPile?.length || 0;
  }, [gameState.discardPile?.length, playSound]);

  useEffect(() => {
     if (myPlayer) {
         if (myPlayer.hand.length > prevHandLength.current) {
             playSound('draw');
         }
         prevHandLength.current = myPlayer.hand.length;
     }
  }, [myPlayer?.hand.length, playSound]);

  const isMyTurn = gameState.currentPlayerIndex === myPlayerIndex && gameState.status === 'playing';
  const prevTurn = useRef(false);
  useEffect(() => {
     if (isMyTurn && !prevTurn.current) {
         playSound('turn');
     }
     prevTurn.current = isMyTurn;
  }, [isMyTurn, playSound]);

  const [playingCardIds, setPlayingCardIds] = useState<string[]>([]);

  useEffect(() => {
    // Clear optimistic playing state when the server state catches up
    setPlayingCardIds([]);
  }, [gameState.discardPile.length, gameState.players]);

  const handlePlayCard = (card: Card) => {
    
    const isExactMatch = card.color === gameState.discardPile[gameState.discardPile.length-1].color && card.value === gameState.discardPile[gameState.discardPile.length-1].value && card.color !== 'wild';
    const canJumpIn = gameState.jumpInEnabled && !isMyTurn && isExactMatch && gameState.currentPenalty === 0 && !gameState.drawnCardThisTurn && (gameState.jumpInExpiry ? now <= gameState.jumpInExpiry : false);
    if (!isMyTurn && !canJumpIn) return;

    if (card.value === '7' && (gameState.mode === 'no-mercy' || gameState.rule70Enabled)) {
      if (card.color === 'wild') {
         setShowColorPicker({ cardId: card.id });
      } else {
         setShowPlayerPicker({ cardId: card.id });
      }
      return;
    }

    if (card.color === 'wild') {
      setShowColorPicker({ cardId: card.id });
      return;
    }

    setPlayingCardIds(prev => [...prev, card.id]);
    socket.emit('play_card', { roomId: gameState.id, cardId: card.id, topCardId: gameState.discardPile[gameState.discardPile.length - 1]?.id });
  };

  const onColorChosen = (color: CardColor) => {
    if (!showColorPicker) return;
    const cardId = showColorPicker.cardId;
    setShowColorPicker(null);

    const card = myPlayer.hand.find(c => c.id === cardId);
    if (card && card.value === '7' && (gameState.mode === 'no-mercy' || gameState.rule70Enabled)) {
        setShowPlayerPicker({ cardId, chosenColor: color });
        return;
    }

    setPlayingCardIds(prev => [...prev, cardId]);
    socket.emit('play_card', { roomId: gameState.id, cardId, chosenColor: color, topCardId: gameState.discardPile[gameState.discardPile.length - 1]?.id });
  };

  const onPlayerChosen = (targetPlayerId: string) => {
    if (!showPlayerPicker) return;
    
    setPlayingCardIds(prev => [...prev, showPlayerPicker.cardId]);
    socket.emit('swap_hand', { 
       roomId: gameState.id, 
       targetPlayerId, 
       cardId: showPlayerPicker.cardId, 
       chosenColor: showPlayerPicker.chosenColor 
    });
    setShowPlayerPicker(null);
  };

  const handleDraw = () => {
    if (!isMyTurn) return;
    socket.emit('draw_card', gameState.id);
  };

  const startGame = () => {
    socket.emit('start_game', gameState.id);
  };

  if (!myPlayer) return null;

  // Calculate positions for other players
  const otherPlayers = [];
  for (let i = 1; i < gameState.players.length; i++) {
    const idx = (myPlayerIndex + i) % gameState.players.length;
    otherPlayers.push(gameState.players[idx]);
  }


    let hasPlayableCard = false;
  if (myPlayer) {
      const topCard = gameState.discardPile[gameState.discardPile.length - 1];
      hasPlayableCard = myPlayer.hand.some(card => {
          if (gameState.currentPenalty > 0 && gameState.stackingEnabled) {
              if (gameState.mode === 'no-mercy') {
                  const topDrawVal = getDrawValue(topCard.value);
                  const playDrawVal = getDrawValue(card.value);
                  return topDrawVal > 0 && playDrawVal >= topDrawVal;
              } else {
                  return (topCard.value === 'draw4' && card.value === 'draw4') ||
                         (topCard.value === 'draw2' && (card.value === 'draw2' || card.value === 'draw4'));
              }
          } else if (gameState.currentPenalty === 0) {
              return card.color === gameState.currentColor || card.color === 'wild' || card.value === topCard.value;
          }
          return false;
      });
  }

  const hidePassTurn = (gameState.forcePlayEnabled || gameState.mode === 'no-mercy') && hasPlayableCard;

  return (
    <LayoutGroup>
    <div className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_center,_#1c1c24_0%,_#0a0a0c_80%)]">
      {/* Header */}
      <header className="h-14 px-6 flex items-center justify-between bg-[#141418] border-b border-white/10 z-50">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-black italic tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            UNO<span className="text-red-500">WILD</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
          <span className={`px-3 py-1 border rounded text-[10px] font-bold tracking-widest uppercase ${gameState.mode === 'no-mercy' ? 'bg-red-600/20 border-red-500/40 text-red-400' : 'bg-blue-600/20 border-blue-500/40 text-blue-400'}`}>
            {gameState.mode} MODE
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-xs font-mono text-white/50">
            LOBBY: <span className="text-white">{gameState.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <span className="text-xs font-medium text-white/70">{gameState.players.length}/10 PLAYERS</span>
          </div>
          <button onClick={() => window.location.reload()} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded text-xs font-bold transition-all text-white">
            QUIT
          </button>
        </div>
      </header>

      {gameState.status === 'finished' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 z-50">
           <div className="bg-neutral-900 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center max-w-lg w-full text-center">
              <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-yellow-600 drop-shadow-lg mb-8">
                 LEADERBOARD
              </h1>
              
              <div className="w-full flex flex-col gap-3 mb-8 text-left">
                {gameState.winners && gameState.winners.length > 0 ? (
                  gameState.winners.map((w) => (
                    <div key={w.name} className="flex items-center justify-between bg-black/40 px-6 py-4 rounded-xl border border-white/5">
                       <div className="flex items-center gap-4">
                          <span className={`text-2xl font-black italic ${w.place === 1 ? 'text-yellow-400' : w.place === 2 ? 'text-gray-300' : w.place === 3 ? 'text-amber-600' : 'text-white/50'}`}>
                             #{w.place}
                          </span>
                          <span className="text-xl font-bold text-white">{w.name}</span>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xl font-medium text-white mb-8 text-center">
                    <span className="font-bold text-green-400">{gameState.winner}</span> won the game!
                  </div>
                )}
                {/* Find eliminated players or players who didn't win */}
                {gameState.players.filter(p => !p.finishedPlace && p.eliminated).map(p => (
                    <div key={p.name} className="flex items-center justify-between bg-black/40 px-6 py-4 rounded-xl border border-red-500/20 opacity-50">
                       <div className="flex items-center gap-4">
                          <span className="text-xl font-black italic text-red-500">
                             ELIM
                          </span>
                          <span className="text-lg font-bold text-white line-through">{p.name}</span>
                       </div>
                    </div>
                ))}
              </div>

              {myPlayer?.isHost ? (
                  <button 
                    onClick={() => socket.emit("play_again", gameState.id)} 
                    className="px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-all shadow-lg hover:scale-105"
                  >
                    Return to Lobby
                  </button>
              ) : (
                  <div className="text-white/50 animate-pulse font-medium">
                      Waiting for host to return to lobby...
                  </div>
              )}
           </div>
        </div>
      ) : gameState.status === 'lobby' ? (
        <div className="flex-1 flex flex-col md:flex-row items-stretch justify-center p-4 gap-6 max-w-5xl mx-auto w-full">
          {/* Player List Panel */}
          <div className="bg-black/40 p-8 rounded-xl flex-1 flex flex-col border border-white/10 shadow-2xl backdrop-blur-md min-w-[300px]">
            <h3 className="text-2xl font-bold mb-6 flex items-center justify-between">
                Waiting for players...
                <span className="text-sm font-normal text-white/50">{gameState.players.length}/10</span>
            </h3>
            <div className="space-y-2 mb-8 flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[200px]">
              {gameState.players.map((p, i) => (
                <div key={p.id} className="flex justify-between items-center bg-white/5 p-3 rounded relative">
                  <span className="font-medium flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                        {p.avatar ? <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-xs">{p.name.substring(0, 2).toUpperCase()}</span>}
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#121214] ${p.connected ? 'bg-green-500' : 'bg-neutral-500'}`}></span>
                    </div>
                    {p.name} {p.id === socketId && <span className="text-white/40 text-xs italic">(You)</span>} {p.isBot && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded uppercase font-bold">Bot</span>}
                  </span>
                  <div className="flex items-center gap-2">
                    {p.isHost && <span className="text-yellow-500 text-xs font-bold uppercase">Host</span>}
                    {myPlayer.isHost && p.id !== socketId && (
                       <button onClick={() => socket.emit('remove_player', {roomId: gameState.id, targetId: p.id})} className="text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/40 px-2 py-1 rounded transition-colors uppercase font-bold">Kick</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {myPlayer.isHost ? (
                <button
                  onClick={() => socket.emit('add_bot', gameState.id)}
                  disabled={gameState.players.length >= 10}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 font-bold rounded-lg disabled:opacity-50 transition border border-white/10"
                >
                  + Add Bot
                </button>
            ) : (
                <p className="text-center text-neutral-400 animate-pulse mt-auto">Waiting for host to start...</p>
            )}
          </div>

          {/* Settings Panel */}
          <div className="bg-black/40 p-8 rounded-xl flex-1 flex flex-col border border-white/10 shadow-2xl backdrop-blur-md min-w-[300px] relative">
             {!myPlayer.isHost && (
                 <div className="absolute inset-0 z-10 bg-black/10 rounded-xl pointer-events-none flex items-center justify-center">
                    {/* Just an overlay if we wanted, but we'll disable individual controls */}
                 </div>
             )}
             <h3 className="text-2xl font-bold mb-6 flex justify-between items-center">
                Game Settings
                {!myPlayer.isHost && <span className="text-[10px] bg-white/10 px-2 py-1 rounded uppercase tracking-widest text-white/50">Read Only</span>}
             </h3>
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6 space-y-4">
                 <div className={!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}>
                    <label className="text-sm font-bold block mb-2 text-neutral-300">Game Mode</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateSettings({mode: 'normal'})}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                          gameState.mode === 'normal' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => handleUpdateSettings({mode: 'no-mercy', limit: Math.max(25, gameState.eliminationLimit || 25)})}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                          gameState.mode === 'no-mercy' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        No Mercy
                      </button>
                    </div>
                 </div>
                 
                 {gameState.mode === 'no-mercy' && (
                     <div className={`bg-white/5 border border-white/10 p-3 rounded-lg ${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}`}>
                         <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-neutral-300">Elimination Limit</label>
                            <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded overflow-hidden">
                               <button 
                                  onClick={() => handleUpdateSettings({limit: Math.max(25, (gameState.eliminationLimit || 25) - 1)})}
                                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white transition-colors"
                               >
                                  -
                               </button>
                               <input 
                                  type="number" 
                                  min="25" 
                                  max="70" 
                                  value={gameState.eliminationLimit || 25} 
                                  onChange={(e) => handleUpdateSettings({limit: Math.max(25, parseInt(e.target.value) || 25)})} 
                                  className="bg-transparent w-12 text-center text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                               />
                               <button 
                                  onClick={() => handleUpdateSettings({limit: Math.min(70, (gameState.eliminationLimit || 25) + 1)})}
                                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white transition-colors"
                               >
                                  +
                               </button>
                            </div>
                         </div>
                         <div className="text-[10px] text-white/40 mt-1">Players are eliminated when reaching this card limit (Min 25).</div>
                     </div>
                 )}
                 {gameState.mode === 'normal' && (
                     <div className={`bg-white/5 border border-white/10 p-3 rounded-lg ${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}`}>
                         <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-neutral-300">Win Limit</label>
                            <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded overflow-hidden">
                               <button 
                                  onClick={() => handleUpdateSettings({winLimit: Math.max(1, (gameState.winLimit || 1) - 1)})}
                                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white transition-colors"
                               >
                                  -
                               </button>
                               <input 
                                  type="number" 
                                  min="1" 
                                  max={9} 
                                  value={gameState.winLimit || 1} 
                                  onChange={(e) => handleUpdateSettings({winLimit: Math.max(1, parseInt(e.target.value) || 1)})} 
                                  className="bg-transparent w-12 text-center text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                               />
                               <button 
                                  onClick={() => handleUpdateSettings({winLimit: Math.min(9, (gameState.winLimit || 1) + 1)})}
                                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white transition-colors"
                               >
                                  +
                               </button>
                            </div>
                         </div>
                         <div className="text-[10px] text-white/40 mt-1">Number of players who can win before game ends.</div>
                     </div>
                 )}
                 <div className={`flex justify-between items-center pt-2 border-t border-white/10 ${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}`}>
                    <label className="text-sm font-bold text-neutral-300">Enable Stacking</label>
                    <input type="checkbox" checked={gameState.stackingEnabled || false} onChange={(e) => handleUpdateSettings({stackingEnabled: e.target.checked})} className="w-5 h-5 accent-red-500" disabled={gameState.mode === 'no-mercy'} />
                 </div>
                 <div className="text-[10px] text-white/40 -mt-3">Stack +2 and +4 cards.</div>
                 <div className={`flex justify-between items-center pt-2 border-t border-white/10 ${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}`}>
                    <label className="text-sm font-bold text-neutral-300">Enable Jump-In</label>
                    <input type="checkbox" checked={gameState.jumpInEnabled || false} onChange={(e) => handleUpdateSettings({jumpIn: e.target.checked})} className="w-5 h-5 accent-red-500" />
                 </div>
                 <div className="text-[10px] text-white/40 -mt-3">Play matching cards out of turn.</div>
                 
                 <div className={`flex justify-between items-center pt-2 border-t border-white/10 ${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}`}>
                    <label className="text-sm font-bold text-neutral-300">7-0 Rule</label>
                    <input type="checkbox" checked={gameState.rule70Enabled || false} onChange={(e) => handleUpdateSettings({rule70Enabled: e.target.checked})} className="w-5 h-5 accent-red-500" />
                 </div>
                 <div className="text-[10px] text-white/40 -mt-3">0 rotates hands, 7 swaps hand with a player.</div>

                 <div className={`flex justify-between items-center pt-2 border-t border-white/10 ${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}`}>
                    <label className="text-sm font-bold text-neutral-300">Force Play</label>
                    <input type="checkbox" checked={gameState.forcePlayEnabled || false} onChange={(e) => handleUpdateSettings({forcePlayEnabled: e.target.checked})} className="w-5 h-5 accent-red-500" />
                 </div>
                 <div className="text-[10px] text-white/40 -mt-3">If you draw a playable card, you MUST play it.</div>

                 <div className={`flex justify-between items-center pt-2 border-t border-white/10 ${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}`}>
                    <label className="text-sm font-bold text-neutral-300">Turn Timer</label>
                    <select value={gameState.turnTimeLimit || 0} onChange={(e) => handleUpdateSettings({turnTimeLimit: parseInt(e.target.value) || 0})} className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-white/30">
                       <option value={0}>Unlimited</option>
                       <option value={10}>10 Seconds</option>
                       <option value={15}>15 Seconds</option>
                       <option value={30}>30 Seconds</option>
                       <option value={60}>60 Seconds</option>
                    </select>
                 </div>
                 
                 <div className={`flex justify-between items-center pt-2 border-t border-white/10 ${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}`}>
                    <label className="text-sm font-bold text-neutral-300">Bot Speed</label>
                    <select value={gameState.botSpeed || 1500} onChange={(e) => handleUpdateSettings({botSpeed: parseInt(e.target.value) || 1500})} className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-white/30">
                       <option value={500}>Fast (0.5s)</option>
                       <option value={1500}>Normal (1.5s)</option>
                       <option value={3000}>Slow (3.0s)</option>
                    </select>
                 </div>
             </div>
             
             {myPlayer.isHost ? (
               <button
                 onClick={startGame}
                 disabled={gameState.players.length < 2}
                 className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 font-bold rounded-lg disabled:opacity-50 disabled:grayscale transition transform active:scale-95 text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] mt-auto"
               >
                 Start Game
               </button>
             ) : (
                <div className="w-full py-4 bg-white/5 border border-white/10 font-bold rounded-lg text-center text-white/50 mt-auto flex items-center justify-center gap-3">
                   <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
                   Waiting for Host...
                </div>
             )}
          </div>
        </div>
      ) : (
        <div className="flex-1 relative overflow-hidden flex flex-col">
           {/* Last Action Toast */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <AnimatePresence mode="wait">
               {gameState.lastActionMessage && (
                  <motion.div
                     key={gameState.lastActionMessage}
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     transition={{ duration: 0.3 }}
                     className="bg-black/60 backdrop-blur text-white px-4 py-2 rounded-full font-medium text-sm border border-white/10 shadow-lg flex items-center gap-2"
                  >
                     <Info size={16} className="text-blue-400" />
                     {gameState.lastActionMessage}
                  </motion.div>
               )}
            </AnimatePresence>
          </div>

          {/* Other Players */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {otherPlayers.map((p, i) => {
              const N = otherPlayers.length;
              let angle = Math.PI / 2; // Default to top if only 1 player
              if (N > 1) {
                 const startAngle = Math.PI * 0.9;
                 const endAngle = Math.PI * 0.1;
                 angle = startAngle - (i / (N - 1)) * (startAngle - endAngle);
              }
              
              // Oval bounds
              const top = 32 - Math.sin(angle) * 22; // %
              const left = 50 + Math.cos(angle) * 42; // %
              
              const isCurrentTurn = gameState.players[gameState.currentPlayerIndex]?.id === p.id;
              
              let baseScale = 1;
              if (N <= 2) baseScale = 1.4;
              else if (N === 3) baseScale = 1.25;
              else if (N === 4) baseScale = 1.1;
              else if (N >= 5) baseScale = 0.9;
              
              const finalScale = isCurrentTurn ? baseScale * 1.15 : baseScale;
              
              return (
                <motion.div 
                  key={p.id} 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: (!p.connected && !p.isBot) || p.eliminated || p.finishedPlace ? 0.4 : 1, scale: finalScale }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.1 }}
                  className={`absolute flex flex-col items-center justify-center transition-all duration-700 ease-out ${(!p.connected && !p.isBot) || p.eliminated || p.finishedPlace ? 'grayscale' : ''} ${isCurrentTurn ? 'z-20' : 'z-10'} pointer-events-auto`}
                  style={{ top: `${top}%`, left: `${left}%`, transform: `translate(-50%, -50%)` }}
                >
                  {/* Name Tag */}
                  <div className="z-20 flex items-center gap-1 text-[10px] font-bold text-white/90 truncate max-w-[140px] bg-black/60 px-3 py-1 rounded-full border border-white/10 shadow-lg mb-1 whitespace-nowrap">
                    {p.name} {p.eliminated && <span className="text-red-500">❌</span>} {p.finishedPlace && <span className="text-yellow-500">🏆</span>}
                  </div>
                  
                  {/* Avatar */}
                  <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center text-sm font-black shadow-2xl transition-colors duration-500 z-10 ${isCurrentTurn ? 'bg-yellow-500/30 border-2 border-yellow-400 ring-4 ring-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.5)] text-yellow-300' : 'bg-[#1a1a1a] border-2 border-white/20 text-white/70'}`}>
                    {p.avatar ? (
                        <img src={p.avatar} alt={p.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span>{p.name.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  
                  {/* Cards */}
                  <div className="-mt-3">
                    <OpponentHand count={p.hand.length} />
                  </div>
                  
                  {!p.connected && <div className="text-[10px] text-red-500 font-bold uppercase absolute -right-6 top-6 bg-black/80 px-2 py-1 rounded border border-red-500/30 z-30">(DC)</div>}
                  
                  {p.finishedPlace && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-40">
                      <div className="text-yellow-400 font-black text-2xl rotate-12 uppercase drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                         #{p.finishedPlace}
                      </div>
                    </div>
                  )}
                  {p.hand.length === 1 && !p.unoCalled && !p.finishedPlace && (
                     <button onClick={() => socket.emit('catch_uno', {roomId: gameState.id, targetId: p.id})} className="absolute -bottom-4 text-[9px] bg-red-600 hover:bg-red-500 font-black px-3 py-1 rounded-full text-white animate-bounce shadow-[0_0_15px_rgba(220,38,38,1)] border border-red-400 z-50 whitespace-nowrap">
                        CATCH UNO!
                     </button>
                  )}
                  {p.eliminated && <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-40"><span className="text-red-500 font-black text-xs rotate-12 uppercase">Eliminated</span></div>}
                </motion.div>
              );
            })}
          </div>

          {/* Center Area (Deck & Discard) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-12 z-10">
            {/* Deck */}
            <motion.div whileHover={isMyTurn && !gameState.drawnCardThisTurn ? { scale: 1.05, y: -5 } : {}} whileTap={isMyTurn && !gameState.drawnCardThisTurn ? { scale: 0.95 } : {}} className={`relative ${isMyTurn && !gameState.drawnCardThisTurn ? 'cursor-pointer group hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all' : 'opacity-70 pointer-events-none'}`} onClick={handleDraw}>
              <div className="rotate-2 transition-transform group-hover:rotate-0 drop-shadow-2xl">
                 <CardBack size="md" />
              </div>
              <div className="absolute -top-2 -left-1 -z-10 translate-x-1 translate-y-1">
                 <CardBack size="md" className="opacity-80" />
              </div>
              <div className="absolute -top-4 -left-2 -z-20 translate-x-2 translate-y-2">
                 <CardBack size="md" className="opacity-60" />
              </div>
              
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest text-white/40 uppercase whitespace-nowrap">Draw Pile</div>
              {isMyTurn && !gameState.drawnCardThisTurn && (
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-xs animate-bounce whitespace-nowrap shadow-lg uppercase">
                    {gameState.currentPenalty > 0 ? `Draw ${gameState.currentPenalty}` : 'Draw Card'}
                 </div>
              )}
            </motion.div>

            {/* Turn direction indicator / Stack Info */}
            <div className="flex flex-col items-center justify-center mx-4 relative w-36 h-36">
              <div className={`absolute inset-0 border-[8px] border-dashed rounded-full -z-30 opacity-80 pointer-events-none transition-transform duration-1000 ${gameState.direction === 1 ? 'animate-[spin_10s_linear_infinite]' : 'animate-[spin_10s_linear_reverse_infinite]'}`} style={{ borderColor: getColorHex(gameState.currentColor), boxShadow: `0 0 40px ${getColorHex(gameState.currentColor)}60, inset 0 0 40px ${getColorHex(gameState.currentColor)}60` }}>
              </div>
              {gameState.currentPenalty > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-red-500 text-4xl font-black mb-1 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">+{gameState.currentPenalty}</div>
                  <div className="text-[10px] font-bold text-white/50 tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded">Stack</div>
                </div>
              )}
            </div>

            {/* Discard Pile */}
            <div className="relative w-24 h-36">
              <AnimatePresence>
                {gameState.discardPile.slice(-3).map((card, i, arr) => (
                  <motion.div 
                    key={card.id}
                    layoutId={card.id}
                    className="absolute top-0 left-0"
                    style={{ zIndex: i }}
                    initial={{ scale: 1.5, opacity: 0, y: -100, rotate: Math.random() * 20 - 10 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1, 
                      rotate: (i - arr.length + 1) * 8 - 6,
                      x: (i - arr.length + 1) * 2,
                      y: (i - arr.length + 1) * 2
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <PlayingCard card={card} isCurrentColor={i === arr.length - 1 ? gameState.currentColor : undefined} />
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest text-white/40 uppercase whitespace-nowrap">Discard</div>
            </div>
          </div>

          {/* My Hand */}
          <div className={`h-64 shrink-0 border-t flex items-center justify-center relative mt-auto z-40 transition-all duration-500 ${isMyTurn ? 'bg-[#15120a] border-yellow-500/50 shadow-[0_-15px_50px_rgba(234,179,8,0.15)]' : 'bg-[#08080a] border-white/10'}`}>
             {myPlayer.eliminated && <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center"><span className="text-red-500 font-black text-6xl tracking-tighter shadow-2xl">ELIMINATED</span></div>}
             
             <div className={`absolute left-1/2 -translate-x-1/2 px-6 py-2 rounded-full uppercase flex items-center gap-3 z-[60] transition-all duration-300 shadow-2xl ${isMyTurn ? '-top-8 bg-yellow-500 text-black border-2 border-yellow-300 scale-110 shadow-yellow-500/50 font-black tracking-widest text-sm' : '-top-6 bg-[#0a0a0c] border border-white/10 text-[10px] font-bold text-white/40 tracking-widest'}`}>
                <div className={`w-8 h-8 rounded-full overflow-hidden bg-black/20 flex items-center justify-center ${isMyTurn ? 'border-2 border-black/30' : 'border border-white/10'}`}>
                    {myPlayer.avatar ? <img src={myPlayer.avatar} alt={myPlayer.name} className="w-full h-full object-cover" /> : <span>{myPlayer.name.substring(0,2).toUpperCase()}</span>}
                </div>
                {isMyTurn && <div className="w-3 h-3 rounded-full bg-black animate-ping"></div>}
                {isMyTurn ? "YOUR TURN!" : "WAITING..."} <span className={`ml-2 px-2 py-1 rounded text-xs shadow-md ${isMyTurn ? 'bg-black/20 text-black border border-black/20' : 'bg-black/50 text-white border border-white/20'}`}>{myPlayer.hand.length} CARDS</span>
                {timeLeft !== null && (
                   <span className={`ml-2 px-2 py-0.5 rounded ${timeLeft <= 5 ? 'bg-red-500 text-white font-bold animate-pulse' : (isMyTurn ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-white')}`}>
                      {timeLeft}s
                   </span>
                )}
             </div>

             <div className="absolute bottom-[110%] right-6 flex flex-col gap-3 z-50">
                 {isMyTurn && gameState.drawnCardThisTurn && !hidePassTurn && !myPlayer.eliminated && (
                    <button 
                       onClick={() => socket.emit('pass_turn', gameState.id)}
                      className="w-32 py-3 bg-neutral-600 hover:bg-neutral-500 text-white font-black text-xs tracking-widest rounded-md border border-white/10 shadow-lg"
                    >
                      PASS TURN
                    </button>
                 )}
                 {isMyTurn && myPlayer.hand.length > 0 && myPlayer.hand.length <= 2 && !myPlayer.unoCalled && !myPlayer.eliminated && (
                    <button 
                      onClick={() => socket.emit('call_uno', gameState.id)}
                      className="w-32 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs italic tracking-tighter rounded-md shadow-lg shadow-red-600/20 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all animate-pulse"
                    >
                      SAY UNO!
                    </button>
                 )}
                {!myPlayer.eliminated && <button 
                  onClick={() => socket.emit('sort_hand', gameState.id)}
                  className="w-32 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] tracking-widest rounded-md border border-white/10"
                >
                  SORT HAND
                </button>}

             </div>
             
             <div 
                 onWheel={(e) => { e.currentTarget.scrollLeft += e.deltaY; }} 
                 className="flex -space-x-8 px-8 w-full items-center overflow-x-auto h-full pt-4 pb-0 hide-scrollbar"
                 style={{ justifyContent: 'safe center' }}>
               
               {myPlayer.eliminated ? (
                   <div className="text-4xl font-black text-red-500 tracking-widest drop-shadow-lg">ELIMINATED</div>
               ) : myPlayer.finishedPlace ? (
                   <div className="text-4xl font-black text-yellow-500 tracking-widest drop-shadow-lg">FINISHED #{myPlayer.finishedPlace}</div>
               ) : (
                 <AnimatePresence>
                   {myPlayer.hand.filter(c => !playingCardIds.includes(c.id)).map((card, index) => {
                     
                     const isExactMatch = card.color === gameState.discardPile[gameState.discardPile.length-1].color && card.value === gameState.discardPile[gameState.discardPile.length-1].value && card.color !== 'wild';
                   const canJumpIn = gameState.jumpInEnabled && !isMyTurn && isExactMatch && gameState.currentPenalty === 0 && !gameState.drawnCardThisTurn && (gameState.jumpInExpiry ? now <= gameState.jumpInExpiry : false);
                   
                   let isValid = false;
                   if (isMyTurn) {
                      const topCard = gameState.discardPile[gameState.discardPile.length-1];
                      if (gameState.currentPenalty > 0 && gameState.stackingEnabled) {
                              if (gameState.mode === 'no-mercy') {
                                  const topDrawVal = getDrawValue(topCard.value);
                                  const playDrawVal = getDrawValue(card.value);
                                  isValid = topDrawVal > 0 && playDrawVal >= topDrawVal;
                              } else {
                                  isValid = (topCard.value === 'draw4' && card.value === 'draw4') || 
                                            (topCard.value === 'draw2' && (card.value === 'draw2' || card.value === 'draw4'));
                              }
                          } else if (gameState.currentPenalty === 0) {
                              isValid = card.color === gameState.currentColor || card.color === 'wild' || card.value === topCard.value;
                          }
                   } else if (canJumpIn) {
                      isValid = true;
                   }



                   return (
                     <motion.div
                       key={card.id}
                       layoutId={card.id}
                       layout
                       initial={{ opacity: 0, y: -200, scale: 0.2, zIndex: index }}
                       animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, x: 0, zIndex: index, transition: { delay: (index % 10) * 0.15 } }}
                       exit={{ opacity: 0, scale: 0.5, zIndex: index }}
                       whileHover={{ y: -24, rotate: (index % 2 === 0 ? 3 : -2), zIndex: 50, scale: 1.05 }}
                       className={`relative shrink-0 shadow-2xl ${!isValid && isMyTurn ? 'opacity-50 brightness-75 grayscale-[20%]' : ''} ${isValid ? 'cursor-pointer drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'cursor-default'}`}
                       onClick={() => isValid && handlePlayCard(card)}
                     >
                       <PlayingCard card={card} />
                       {canJumpIn && (
                         <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-black text-xs px-2 py-1 rounded-full whitespace-nowrap shadow-lg border-2 border-yellow-700 z-50 flex flex-col items-center">
                           <span className="animate-pulse">JUMP IN!</span>
                           <span className="text-[9px]">{(Math.max(0, (gameState.jumpInExpiry - now) / 1000)).toFixed(1)}s</span>
                         </div>
                       )}
                     </motion.div>
                   );
                 })}
               </AnimatePresence>
               )}
             </div>
          </div>
        </div>
      )}

      {/* Color Picker Modal */}
      <ColorPickerModal 
        show={!!showColorPicker} 
        onColorChosen={onColorChosen} 
      />

      {/* Player Picker Modal (for 7 in No Mercy) */}
      <PlayerPickerModal 
        show={!!showPlayerPicker} 
        players={otherPlayers.filter(p => !p.eliminated && !p.finishedPlace && (p.connected || p.isBot))} 
        onPlayerChosen={onPlayerChosen} 
        onCancel={() => setShowPlayerPicker(null)} 
      />

      {/* Chat Sidebar */}
      <Chat gameState={gameState} socketId={socketId} />
    </div>
    </LayoutGroup>
  );
}
