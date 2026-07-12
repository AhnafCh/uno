const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const additionalSettings = `
                 <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <label className="text-sm font-bold">Turn Timer</label>
                    <select value={gameState.turnTimeLimit || 0} onChange={(e) => handleUpdateSettings({turnTimeLimit: parseInt(e.target.value) || 0})} className="bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-xs">
                       <option value={0}>Unlimited</option>
                       <option value={10}>10 Seconds</option>
                       <option value={15}>15 Seconds</option>
                       <option value={30}>30 Seconds</option>
                       <option value={60}>60 Seconds</option>
                    </select>
                 </div>
                 <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <label className="text-sm font-bold">Bot Speed</label>
                    <select value={gameState.botSpeed || 1500} onChange={(e) => handleUpdateSettings({botSpeed: parseInt(e.target.value) || 1500})} className="bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-xs">
                       <option value={500}>Fast (0.5s)</option>
                       <option value={1500}>Normal (1.5s)</option>
                       <option value={3000}>Slow (3s)</option>
                    </select>
                 </div>
`;

code = code.replace(/<div className="flex justify-between items-center pt-2 border-t border-white\/10">\s*<label className="text-sm font-bold">Force Play<\/label>[\s\S]*?<\/div>/, "$&\n" + additionalSettings);

fs.writeFileSync('src/components/GameBoard.tsx', code);
