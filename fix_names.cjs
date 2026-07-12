const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const otherPlayersOld = `<div className="absolute inset-0 z-10 pointer-events-none">
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

const otherPlayersNew = `<div className="absolute inset-0 z-10 pointer-events-none">
            {otherPlayers.map((p, i) => {
              const N = otherPlayers.length;
              let angle = Math.PI / 2; // Default to top if only 1 player
              if (N > 1) {
                 const startAngle = Math.PI * 1.12;
                 const endAngle = -Math.PI * 0.12;
                 angle = startAngle - (i / (N - 1)) * (startAngle - endAngle);
              }
              
              // Oval bounds
              const top = 46 - Math.sin(angle) * 31; // %
              const left = 50 + Math.cos(angle) * 44; // %
              
              const isCurrentTurn = gameState.players[gameState.currentPlayerIndex]?.id === p.id;
              
              return (
                <div 
                  key={p.id} 
                  className={\`absolute flex flex-col items-center justify-center transition-all duration-700 ease-out \${!p.connected ? 'opacity-50' : 'opacity-100'} \${isCurrentTurn ? 'scale-110 z-20' : 'scale-100 z-10'} pointer-events-auto\`}
                  style={{ top: \`\${top}%\`, left: \`\${left}%\`, transform: 'translate(-50%, -50%)' }}
                >
                  {/* Name Tag */}
                  <div className="z-20 text-[10px] font-bold text-white/90 truncate max-w-[120px] bg-black/60 px-3 py-1 rounded-full border border-white/10 shadow-lg mb-1 whitespace-nowrap">
                    {p.name}
                  </div>
                  
                  {/* Avatar */}
                  <div className={\`w-14 h-14 rounded-full flex flex-col items-center justify-center text-sm font-black shadow-2xl transition-colors duration-500 z-10 \${isCurrentTurn ? 'bg-yellow-500/30 border-2 border-yellow-400 ring-4 ring-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.5)] text-yellow-300' : 'bg-[#1a1a1a] border-2 border-white/20 text-white/70'}\`}>
                    <span>{p.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                  
                  {/* Cards */}
                  <div className="-mt-3">
                    <OpponentHand count={p.hand.length} />
                  </div>
                  
                  {!p.connected && <div className="text-[10px] text-red-500 font-bold uppercase absolute -right-6 top-6 bg-black/80 px-2 py-1 rounded border border-red-500/30 z-30">(DC)</div>}
                  
                  {p.hand.length === 1 && !p.unoCalled && (
                     <button onClick={() => socket.emit('catch_uno', {roomId: gameState.id, targetId: p.id})} className="absolute -bottom-4 text-[9px] bg-red-600 hover:bg-red-500 font-black px-3 py-1 rounded-full text-white animate-bounce shadow-[0_0_15px_rgba(220,38,38,1)] border border-red-400 z-50 whitespace-nowrap">
                        CATCH UNO!
                     </button>
                  )}
                  {p.eliminated && <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-40"><span className="text-red-500 font-black text-xs rotate-12 uppercase">Eliminated</span></div>}
                </div>
              );
            })}
          </div>`;

if (gameBoard.includes(otherPlayersOld)) {
   gameBoard = gameBoard.replace(otherPlayersOld, otherPlayersNew);
   fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
   console.log('Fixed names');
} else {
   console.log('Could not find otherPlayers block to replace');
}
