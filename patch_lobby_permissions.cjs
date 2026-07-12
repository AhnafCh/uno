const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// I need to change:
// {myPlayer.isHost ? ( <div className="bg-black/40 p-8 rounded-xl flex-1 flex flex-col border border-white/10 shadow-2xl backdrop-blur-md min-w-[300px]"> ... </div> ) : ( <div ...>Waiting for Host</div> )}
// to just one block where the settings are shown, but only host can change them.

const oldSettingsRegex = /\{\s*myPlayer\.isHost \? \(\s*<div className="bg-black\/40 p-8 rounded-xl flex-1 flex flex-col border border-white\/10 shadow-2xl backdrop-blur-md min-w-\[300px\]">([\s\S]*?)<\/div>\s*\)\s*:\s*\(\s*<div className="bg-black\/40 p-8 rounded-xl flex-1 flex flex-col items-center justify-center border border-white\/10 shadow-2xl backdrop-blur-md min-w-\[300px\]">[\s\S]*?<\/div>\s*\)\s*\}/;

const newSettings = `<div className="bg-black/40 p-8 rounded-xl flex-1 flex flex-col border border-white/10 shadow-2xl backdrop-blur-md min-w-[300px] relative">
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
                        className={\`flex-1 py-2 rounded-lg text-sm font-bold transition-colors \${
                          gameState.mode === 'normal' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                        }\`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => handleUpdateSettings({mode: 'no-mercy', limit: Math.max(20, gameState.eliminationLimit || 20)})}
                        className={\`flex-1 py-2 rounded-lg text-sm font-bold transition-colors \${
                          gameState.mode === 'no-mercy' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                        }\`}
                      >
                        No Mercy
                      </button>
                    </div>
                 </div>
                 
                 {gameState.mode === 'no-mercy' && (
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
                 <div className={\`flex justify-between items-center pt-2 border-t border-white/10 \${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}\`}>
                    <label className="text-sm font-bold text-neutral-300">Enable Jump-In</label>
                    <input type="checkbox" checked={gameState.jumpInEnabled || false} onChange={(e) => handleUpdateSettings({jumpIn: e.target.checked})} className="w-5 h-5 accent-red-500" />
                 </div>
                 <div className="text-[10px] text-white/40 -mt-3">Play matching cards out of turn.</div>
                 
                 <div className={\`flex justify-between items-center pt-2 border-t border-white/10 \${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}\`}>
                    <label className="text-sm font-bold text-neutral-300">7-0 Rule</label>
                    <input type="checkbox" checked={gameState.rule70Enabled || false} onChange={(e) => handleUpdateSettings({rule70Enabled: e.target.checked})} className="w-5 h-5 accent-red-500" />
                 </div>
                 <div className="text-[10px] text-white/40 -mt-3">0 rotates hands, 7 swaps hand with a player.</div>

                 <div className={\`flex justify-between items-center pt-2 border-t border-white/10 \${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}\`}>
                    <label className="text-sm font-bold text-neutral-300">Force Play</label>
                    <input type="checkbox" checked={gameState.forcePlayEnabled || false} onChange={(e) => handleUpdateSettings({forcePlayEnabled: e.target.checked})} className="w-5 h-5 accent-red-500" />
                 </div>
                 <div className="text-[10px] text-white/40 -mt-3">If you draw a playable card, you MUST play it.</div>

                 <div className={\`flex justify-between items-center pt-2 border-t border-white/10 \${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}\`}>
                    <label className="text-sm font-bold text-neutral-300">Turn Timer</label>
                    <select value={gameState.turnTimeLimit || 0} onChange={(e) => handleUpdateSettings({turnTimeLimit: parseInt(e.target.value) || 0})} className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-white/30">
                       <option value={0}>Unlimited</option>
                       <option value={10}>10 Seconds</option>
                       <option value={15}>15 Seconds</option>
                       <option value={30}>30 Seconds</option>
                       <option value={60}>60 Seconds</option>
                    </select>
                 </div>
                 
                 <div className={\`flex justify-between items-center pt-2 border-t border-white/10 \${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}\`}>
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
          </div>`;

code = code.replace(oldSettingsRegex, newSettings);

fs.writeFileSync('src/components/GameBoard.tsx', code);
