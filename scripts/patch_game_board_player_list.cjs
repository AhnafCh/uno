const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const oldList = /<div className="space-y-2 mb-8">[\s\S]*?<\/div>(\s*)\{myPlayer\.isHost \? \(/;

const newList = `<div className="space-y-2 mb-8 max-h-48 overflow-y-auto custom-scrollbar pr-2">
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
            </div>$1{myPlayer.isHost ? (`;

code = code.replace(oldList, newList);
fs.writeFileSync('src/components/GameBoard.tsx', code);
