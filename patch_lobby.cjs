const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const addBotBtn = `<button
                  onClick={() => socket.emit('add_bot', gameState.id)}
                  disabled={gameState.players.length >= 10}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 font-bold rounded-lg disabled:opacity-50 transition border border-white/10"
                >
                  + Add Bot
                </button>`;

const newBtns = `<div className="flex gap-2 w-full">
                  <button
                    onClick={() => socket.emit('add_bot', gameState.id)}
                    disabled={gameState.players.length >= 10}
                    className="flex-1 py-4 bg-white/10 hover:bg-white/20 font-bold rounded-lg disabled:opacity-50 transition border border-white/10"
                  >
                    + Add Bot
                  </button>
                  <button
                    onClick={() => socket.emit('shuffle_players', gameState.id)}
                    className="flex-1 py-4 bg-white/10 hover:bg-white/20 font-bold rounded-lg transition border border-white/10"
                  >
                    🔀 Shuffle Seats
                  </button>
                </div>`;

code = code.replace(addBotBtn, newBtns);
fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Added Shuffle Seats button");
