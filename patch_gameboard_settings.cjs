const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

// Patch handleUpdateSettings
code = code.replace(
    /botSpeed: gameState\.botSpeed \|\| 1500,\s*turnTimeLimit: gameState\.turnTimeLimit \|\| 0,\s*\.\.\.updates/,
    "botSpeed: gameState.botSpeed || 1500,\n      turnTimeLimit: gameState.turnTimeLimit || 0,\n      stackingEnabled: gameState.stackingEnabled || false,\n      ...updates"
);

const targetUI = `<div className={\`flex justify-between items-center pt-2 border-t border-white/10 \${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}\`}>
                    <label className="text-sm font-bold text-neutral-300">Enable Jump-In</label>
                    <input type="checkbox" checked={gameState.jumpInEnabled || false} onChange={(e) => handleUpdateSettings({jumpIn: e.target.checked})} className="w-5 h-5 accent-red-500" />
                 </div>`;

const insertUI = `<div className={\`flex justify-between items-center pt-2 border-t border-white/10 \${!myPlayer.isHost ? 'opacity-70 pointer-events-none' : ''}\`}>
                    <label className="text-sm font-bold text-neutral-300">Enable Stacking</label>
                    <input type="checkbox" checked={gameState.stackingEnabled || false} onChange={(e) => handleUpdateSettings({stackingEnabled: e.target.checked})} className="w-5 h-5 accent-red-500" disabled={gameState.mode === 'no-mercy'} />
                 </div>
                 <div className="text-[10px] text-white/40 -mt-3">Stack +2 and +4 cards.</div>
                 ` + targetUI;

code = code.replace(targetUI, insertUI);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Patched gameboard settings UI");
