const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// The original UI change I did
code = code.replace(/\{gameState\.mode === 'no-mercy' && \(\s*<div className="bg-red-500\/10 border border-red-500\/20 p-3 rounded-lg">([\s\S]*?)<\/div>\s*\)\}/, `<div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                         <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-neutral-300">Elimination Limit</label>
                            <input type="number" min="20" max="100" value={gameState.eliminationLimit || 20} onChange={(e) => handleUpdateSettings({limit: Math.max(20, parseInt(e.target.value) || 20)})} className="bg-black/50 border border-white/10 rounded px-3 py-1 w-20 text-center text-white focus:outline-none focus:border-white/30" />
                         </div>
                         <div className="text-[10px] text-white/40 mt-1">Players are eliminated when reaching this card limit (Min 20).</div>
                     </div>`);

fs.writeFileSync('src/components/GameBoard.tsx', code);
