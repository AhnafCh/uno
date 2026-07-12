const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const regex = /<div className="flex-1 flex flex-col items-center justify-center p-4">\s*<div className="bg-black\/40 p-8 rounded-xl max-w-lg w-full text-center border border-white\/10 shadow-2xl backdrop-blur-md">[\s\S]*?<\/div>\s*<\/div>\s*\)\s*:\s*\(/;

const newLobby = `<div className="flex-1 flex flex-col md:flex-row items-stretch justify-center p-4 gap-6 max-w-5xl mx-auto w-full">
          {/* Player List Panel */}
          <div className="bg-black/40 p-8 rounded-xl flex-1 flex flex-col border border-white/10 shadow-2xl backdrop-blur-md min-w-[300px]">
            <h3 className="text-2xl font-bold mb-6 flex items-center justify-between">
                Waiting for players...
                <span className="text-sm font-normal text-white/50">{gameState.players.length}/10</span>
            </h3>
            <div className="space-y-2 mb-8 flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[200px]">
              {gameState.players.map((p, i) => (
                <div key={p.id} className="flex justify-between items-center bg-white/5 p-3 rounded relative">
                  <span className="font-medium flex items-center gap-2">
                    <span className={\`w-3 h-3 rounded-full \${p.connected ? 'bg-green-500' : 'bg-neutral-500'}\`}></span>
                    {p.name} {p.id === socketId && "(You)"} {p.isBot && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded uppercase font-bold">Bot</span>}
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
          {myPlayer.isHost ? (
          <div className="bg-black/40 p-8 rounded-xl flex-1 flex flex-col border border-white/10 shadow-2xl backdrop-blur-md min-w-[300px]">
             <h3 className="text-2xl font-bold mb-6">Game Settings</h3>
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6 space-y-4">
                 <div>
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
                     <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                         <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-red-200">Elimination Limit</label>
                            <input type="number" min="20" max="100" value={gameState.eliminationLimit || 20} onChange={(e) => handleUpdateSettings({limit: Math.max(20, parseInt(e.target.value) || 20)})} className="bg-black/50 border border-red-500/30 rounded px-3 py-1 w-20 text-center text-white focus:outline-none focus:border-red-500" />
                         </div>
                         <div className="text-[10px] text-red-300/60 mt-1">Players are eliminated when reaching this card limit (Min 20).</div>
                     </div>
                 )}
                 <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <label className="text-sm font-bold text-neutral-300">Enable Jump-In</label>
                    <input type="checkbox" checked={gameState.jumpInEnabled || false} onChange={(e) => handleUpdateSettings({jumpIn: e.target.checked})} className="w-5 h-5 accent-red-500" />
                 </div>
                 <div className="text-[10px] text-white/40 -mt-3">Play matching cards out of turn.</div>
                 
                 <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <label className="text-sm font-bold text-neutral-300">7-0 Rule</label>
                    <input type="checkbox" checked={gameState.rule70Enabled || false} onChange={(e) => handleUpdateSettings({rule70Enabled: e.target.checked})} className="w-5 h-5 accent-red-500" />
                 </div>
                 <div className="text-[10px] text-white/40 -mt-3">0 rotates hands, 7 swaps hand with a player.</div>

                 <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <label className="text-sm font-bold text-neutral-300">Force Play</label>
                    <input type="checkbox" checked={gameState.forcePlayEnabled || false} onChange={(e) => handleUpdateSettings({forcePlayEnabled: e.target.checked})} className="w-5 h-5 accent-red-500" />
                 </div>
                 <div className="text-[10px] text-white/40 -mt-3">If you draw a playable card, you MUST play it.</div>

                 <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <label className="text-sm font-bold text-neutral-300">Turn Timer</label>
                    <select value={gameState.turnTimeLimit || 0} onChange={(e) => handleUpdateSettings({turnTimeLimit: parseInt(e.target.value) || 0})} className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-white/30">
                       <option value={0}>Unlimited</option>
                       <option value={10}>10 Seconds</option>
                       <option value={15}>15 Seconds</option>
                       <option value={30}>30 Seconds</option>
                       <option value={60}>60 Seconds</option>
                    </select>
                 </div>
                 
                 <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <label className="text-sm font-bold text-neutral-300">Bot Speed</label>
                    <select value={gameState.botSpeed || 1500} onChange={(e) => handleUpdateSettings({botSpeed: parseInt(e.target.value) || 1500})} className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-white/30">
                       <option value={500}>Fast (0.5s)</option>
                       <option value={1500}>Normal (1.5s)</option>
                       <option value={3000}>Slow (3.0s)</option>
                    </select>
                 </div>
             </div>
             
             <button
               onClick={startGame}
               disabled={gameState.players.length < 2}
               className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 font-bold rounded-lg disabled:opacity-50 disabled:grayscale transition transform active:scale-95 text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] mt-auto"
             >
               Start Game
             </button>
          </div>
          ) : (
             <div className="bg-black/40 p-8 rounded-xl flex-1 flex flex-col items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md min-w-[300px]">
                 <div className="w-16 h-16 border-4 border-white/10 border-t-red-500 rounded-full animate-spin mb-6"></div>
                 <p className="text-xl font-bold text-white mb-2">Waiting for Host</p>
                 <p className="text-sm text-neutral-400 text-center">The host is currently configuring the game settings. The match will start shortly.</p>
             </div>
          )}
        </div>
      ) : (`;

code = code.replace(regex, newLobby);
fs.writeFileSync('src/components/GameBoard.tsx', code);
