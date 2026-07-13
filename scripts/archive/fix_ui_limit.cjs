const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const modeSelectionBlock = `                 {gameState.mode === 'no-mercy' && (
                     <div className={\`bg-white/5 border border-white/10 p-3 rounded-lg \${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}\`}>
                         <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-neutral-300">Elimination Limit</label>
                            <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded overflow-hidden">
                               <button 
                                  onClick={() => handleUpdateSettings({limit: Math.max(20, (gameState.eliminationLimit || 20) - 1)})}
                                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white transition-colors"
                               >
                                  -
                               </button>
                               <input 
                                  type="number" 
                                  min="20" 
                                  max="100" 
                                  value={gameState.eliminationLimit || 20} 
                                  onChange={(e) => handleUpdateSettings({limit: Math.max(20, parseInt(e.target.value) || 20)})} 
                                  className="bg-transparent w-12 text-center text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                               />
                               <button 
                                  onClick={() => handleUpdateSettings({limit: Math.min(100, (gameState.eliminationLimit || 20) + 1)})}
                                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white transition-colors"
                               >
                                  +
                               </button>
                            </div>
                         </div>
                         <div className="text-[10px] text-white/40 mt-1">Players are eliminated when reaching this card limit (Min 20).</div>
                     </div>
                 )}`;

const newModeSelectionBlock = `                 {gameState.mode === 'no-mercy' && (
                     <div className={\`bg-white/5 border border-white/10 p-3 rounded-lg \${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}\`}>
                         <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-neutral-300">Elimination Limit</label>
                            <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded overflow-hidden">
                               <button 
                                  onClick={() => handleUpdateSettings({limit: Math.max(20, (gameState.eliminationLimit || 20) - 1)})}
                                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white transition-colors"
                               >
                                  -
                               </button>
                               <input 
                                  type="number" 
                                  min="20" 
                                  max="100" 
                                  value={gameState.eliminationLimit || 20} 
                                  onChange={(e) => handleUpdateSettings({limit: Math.max(20, parseInt(e.target.value) || 20)})} 
                                  className="bg-transparent w-12 text-center text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                               />
                               <button 
                                  onClick={() => handleUpdateSettings({limit: Math.min(100, (gameState.eliminationLimit || 20) + 1)})}
                                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white transition-colors"
                               >
                                  +
                               </button>
                            </div>
                         </div>
                         <div className="text-[10px] text-white/40 mt-1">Players are eliminated when reaching this card limit (Min 20).</div>
                     </div>
                 )}
                 {gameState.mode === 'normal' && (
                     <div className={\`bg-white/5 border border-white/10 p-3 rounded-lg \${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}\`}>
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
                                  max={Math.max(1, gameState.players.length - 1)} 
                                  value={gameState.winLimit || 1} 
                                  onChange={(e) => handleUpdateSettings({winLimit: Math.max(1, parseInt(e.target.value) || 1)})} 
                                  className="bg-transparent w-12 text-center text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                               />
                               <button 
                                  onClick={() => handleUpdateSettings({winLimit: Math.min(Math.max(1, gameState.players.length - 1), (gameState.winLimit || 1) + 1)})}
                                  className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white transition-colors"
                               >
                                  +
                               </button>
                            </div>
                         </div>
                         <div className="text-[10px] text-white/40 mt-1">Number of players who can win before game ends.</div>
                     </div>
                 )}`;

gameBoard = gameBoard.replace(modeSelectionBlock, newModeSelectionBlock);

// Update handleUpdateSettings
gameBoard = gameBoard.replace(`      roomId: gameState.id,
      limit: gameState.eliminationLimit || 0,
      jumpIn: gameState.jumpInEnabled || false,`, `      roomId: gameState.id,
      limit: gameState.eliminationLimit || 0,
      winLimit: gameState.winLimit || 1,
      jumpIn: gameState.jumpInEnabled || false,`);

fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
console.log('Fixed UI limit');
