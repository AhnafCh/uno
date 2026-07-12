const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// Insert OpponentHand before GameBoard
const opponentHandComp = `
function OpponentHand({ count }: { count: number }) {
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
}
`;
gameBoard = gameBoard.replace('export default function GameBoard', opponentHandComp + '\nexport default function GameBoard');


// Replace other players rendering
const otherPlayersOld = `<div className="flex-1 flex items-start justify-center pt-8 px-8 gap-12 flex-wrap">
            {otherPlayers.map(p => (
              <div key={p.id} className={\`flex flex-col items-center gap-2 \${!p.connected ? 'opacity-50' : 'opacity-80 scale-90'} \${gameState.players[gameState.currentPlayerIndex]?.id === p.id ? 'opacity-100 scale-100' : ''} relative\`}>
                <div className={\`w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold \${gameState.players[gameState.currentPlayerIndex]?.id === p.id ? 'bg-yellow-500/20 border-2 border-yellow-500 ring-4 ring-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.3)] text-yellow-400' : 'bg-white/10 border-2 border-white/20'}\`}>
                  {p.name.substring(0, 2).toUpperCase()}
                </div>
                <motion.div 
                  key={p.hand.length}
                  initial={{ scale: 1.5, color: '#eab308' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded uppercase"
                >
                  {p.hand.length} CARDS
                </motion.div>
                {!p.connected && <div className="text-[10px] text-red-500 font-bold uppercase">(DC)</div>}
                {p.hand.length === 1 && !p.unoCalled && (
                   <button onClick={() => socket.emit('catch_uno', {roomId: gameState.id, targetId: p.id})} className="mt-2 text-xs bg-red-600 hover:bg-red-500 font-black px-4 py-1.5 rounded-full text-white animate-bounce shadow-[0_0_15px_rgba(220,38,38,0.8)] border border-red-400 absolute -bottom-10 z-50 whitespace-nowrap">
                      CATCH UNO!
                   </button>
                )}
                {p.eliminated && <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-20"><span className="text-red-500 font-black text-xl rotate-12 uppercase">Eliminated</span></div>}
              </div>
            ))}
          </div>`;

const otherPlayersNew = `<div className="absolute inset-0 z-10 pointer-events-none">
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

// Safely replace the old block with the new block by stripping whitespace for comparison or just targeting it properly.
// Since the old block has exact formatting, let's just do an index-based replace or regex.
// Actually, it's safer to use the exact string.

if (gameBoard.includes(otherPlayersOld)) {
   gameBoard = gameBoard.replace(otherPlayersOld, otherPlayersNew);
   fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
   console.log('Successfully replaced otherPlayers block.');
} else {
   console.log('Failed to find otherPlayers block.');
}
