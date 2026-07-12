const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const gameOverOld = `{gameState.status === 'finished' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
           <div className="bg-neutral-900 border border-white/10 p-12 rounded-3xl shadow-2xl flex flex-col items-center max-w-lg w-full text-center">
              <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-yellow-600 drop-shadow-lg mb-4">
                 GAME OVER
              </h1>
              <div className="text-2xl font-medium text-white mb-8">
                 <span className="font-bold text-green-400">{gameState.winner}</span> won the game!
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
      )`;

const gameOverNew = `{gameState.status === 'finished' ? (
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
                          <span className={\`text-2xl font-black italic \${w.place === 1 ? 'text-yellow-400' : w.place === 2 ? 'text-gray-300' : w.place === 3 ? 'text-amber-600' : 'text-white/50'}\`}>
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
      )`;

gameBoard = gameBoard.replace(gameOverOld, gameOverNew);

// In Opponent cards map, add badge for finished:
const oppHandBadgeOld = `{p.hand.length === 1 && !p.unoCalled && (`;
const oppHandBadgeNew = `{p.finishedPlace && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-40">
                      <div className="text-yellow-400 font-black text-2xl rotate-12 uppercase drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                         #{p.finishedPlace}
                      </div>
                    </div>
                  )}
                  {p.hand.length === 1 && !p.unoCalled && !p.finishedPlace && (`;

gameBoard = gameBoard.replace(oppHandBadgeOld, oppHandBadgeNew);

fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
console.log('Fixed UI');
