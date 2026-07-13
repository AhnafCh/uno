const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const opponentHandOld = `function OpponentHand({ count }: { count: number }) {
  const displayCount = Math.min(count, 13);
  const spread = Math.min(80, displayCount * 8);
  const startAngle = -spread / 2;
  const step = displayCount > 1 ? spread / (displayCount - 1) : 0;
  
  return (
    <div className="relative w-16 h-24 flex justify-center pointer-events-none mt-2">
      {Array.from({ length: displayCount }).map((_, i) => (
         <div 
           key={i} 
           className="absolute w-10 h-14 bg-[#1a1a1a] border border-white/20 rounded shadow-sm flex items-center justify-center origin-bottom top-2"
           style={{ 
             transform: \`rotate(\${startAngle + step * i}deg) translateX(\${(i - displayCount/2) * 1}px)\`,
             zIndex: i
           }}
         >
           <div className="w-6 h-8 border-[2px] border-red-600 rounded-full flex items-center justify-center">
             <span className="text-red-600 font-black text-[5px] tracking-tighter transform -rotate-12">UNO</span>
           </div>
         </div>
      ))}
      <div className="absolute -bottom-2 bg-black/90 px-2 py-0.5 rounded text-white text-[10px] font-black z-50 shadow-xl border border-white/10">
         {count}
      </div>
    </div>
  );
}`;

const opponentHandNew = `function OpponentHand({ count }: { count: number }) {
  const displayCount = Math.min(count, 13);
  const spread = Math.min(100, displayCount * 10);
  const startAngle = -spread / 2;
  const step = displayCount > 1 ? spread / (displayCount - 1) : 0;
  
  return (
    <div className="relative w-24 h-32 flex justify-center pointer-events-none mt-4">
      {Array.from({ length: displayCount }).map((_, i) => (
         <div 
           key={i} 
           className="absolute w-12 h-16 bg-[#1a1a1a] border border-white/20 rounded shadow-md flex items-center justify-center origin-bottom top-4"
           style={{ 
             transform: \`rotate(\${startAngle + step * i}deg) translateX(\${(i - displayCount/2) * 1.5}px)\`,
             zIndex: i
           }}
         >
           <div className="w-8 h-10 border-[2px] border-red-600 rounded-full flex items-center justify-center">
             <span className="text-red-600 font-black text-[6px] tracking-tighter transform -rotate-12">UNO</span>
           </div>
         </div>
      ))}
      <div className="absolute bottom-0 bg-black/90 px-3 py-1 rounded text-white text-xs font-black z-50 shadow-xl border border-white/10">
         {count}
      </div>
    </div>
  );
}`;

gameBoard = gameBoard.replace(opponentHandOld, opponentHandNew);

const otherPlayersOld = `<div className="absolute inset-0 z-10 pointer-events-none">
            {otherPlayers.map((p, i) => {
              const N = otherPlayers.length;
              // Add Math.PI to offset the circle, so it arches over the top
              const angle = Math.PI - ((i + 1) / (N + 1)) * Math.PI;
              const top = 45 - Math.sin(angle) * 35; // %
              const left = 50 + Math.cos(angle) * 40; // %
              
              const isCurrentTurn = gameState.players[gameState.currentPlayerIndex]?.id === p.id;
              
              return (
                <div 
                  key={p.id} 
                  className={\`absolute flex flex-col items-center gap-1 transition-all duration-500 \${!p.connected ? 'opacity-50' : 'opacity-100'} \${isCurrentTurn ? 'scale-110 z-20' : 'scale-90 z-10'} pointer-events-auto\`}
                  style={{ top: \`\${top}%\`, left: \`\${left}%\`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className={\`w-12 h-12 rounded-full flex flex-col items-center justify-center text-xs font-bold \${isCurrentTurn ? 'bg-yellow-500/20 border-2 border-yellow-500 ring-4 ring-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.3)] text-yellow-400' : 'bg-white/10 border-2 border-white/20 text-white/70'}\`}>
                    <span>{p.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="absolute -top-6 text-[10px] font-bold text-white/50 truncate max-w-[80px] bg-black/40 px-2 rounded">{p.name}</div>
                  
                  <OpponentHand count={p.hand.length} />
                  
                  {!p.connected && <div className="text-[10px] text-red-500 font-bold uppercase absolute -right-6 top-0">(DC)</div>}
                  
                  {p.hand.length === 1 && !p.unoCalled && (
                     <button onClick={() => socket.emit('catch_uno', {roomId: gameState.id, targetId: p.id})} className="absolute -bottom-10 text-[9px] bg-red-600 hover:bg-red-500 font-black px-3 py-1 rounded-full text-white animate-bounce shadow-[0_0_15px_rgba(220,38,38,0.8)] border border-red-400 z-50 whitespace-nowrap">
                        CATCH UNO!
                     </button>
                  )}
                  {p.eliminated && <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-30"><span className="text-red-500 font-black text-xs rotate-12 uppercase">Eliminated</span></div>}
                </div>
              );
            })}
          </div>`;

const otherPlayersNew = `<div className="absolute inset-0 z-10 pointer-events-none">
            {otherPlayers.map((p, i) => {
              const N = otherPlayers.length;
              // Spread players across a wider arc, e.g., from 210 degrees to -30 degrees
              let angle = Math.PI / 2; // Default to top if only 1 player
              if (N > 1) {
                 const startAngle = Math.PI * 1.15;
                 const endAngle = -Math.PI * 0.15;
                 angle = startAngle - (i / (N - 1)) * (startAngle - endAngle);
              }
              
              // Wider oval
              const top = 40 - Math.sin(angle) * 35; // %
              const left = 50 + Math.cos(angle) * 45; // %
              
              const isCurrentTurn = gameState.players[gameState.currentPlayerIndex]?.id === p.id;
              
              return (
                <div 
                  key={p.id} 
                  className={\`absolute flex flex-col items-center gap-1 transition-all duration-700 ease-out \${!p.connected ? 'opacity-50' : 'opacity-100'} \${isCurrentTurn ? 'scale-125 z-20' : 'scale-100 z-10'} pointer-events-auto\`}
                  style={{ top: \`\${top}%\`, left: \`\${left}%\`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className="absolute -top-8 text-xs font-bold text-white/70 truncate max-w-[100px] bg-black/60 px-3 py-1 rounded-full border border-white/10 shadow-lg">{p.name}</div>
                  
                  <div className={\`w-16 h-16 rounded-full flex flex-col items-center justify-center text-sm font-black shadow-2xl transition-colors duration-500 \${isCurrentTurn ? 'bg-yellow-500/30 border-2 border-yellow-400 ring-4 ring-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.5)] text-yellow-300' : 'bg-black/40 border-2 border-white/20 text-white/70 backdrop-blur-sm'}\`}>
                    <span>{p.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                  
                  <OpponentHand count={p.hand.length} />
                  
                  {!p.connected && <div className="text-xs text-red-500 font-bold uppercase absolute -right-8 top-0 bg-black/80 px-2 py-1 rounded border border-red-500/30">(DC)</div>}
                  
                  {p.hand.length === 1 && !p.unoCalled && (
                     <button onClick={() => socket.emit('catch_uno', {roomId: gameState.id, targetId: p.id})} className="absolute -bottom-8 text-[10px] bg-red-600 hover:bg-red-500 font-black px-4 py-1.5 rounded-full text-white animate-bounce shadow-[0_0_20px_rgba(220,38,38,1)] border-2 border-red-400 z-50 whitespace-nowrap">
                        CATCH UNO!
                     </button>
                  )}
                  {p.eliminated && <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-30"><span className="text-red-500 font-black text-sm rotate-12 uppercase">Eliminated</span></div>}
                </div>
              );
            })}
          </div>`;

gameBoard = gameBoard.replace(otherPlayersOld, otherPlayersNew);
fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
