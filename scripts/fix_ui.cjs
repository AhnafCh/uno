const fs = require('fs');

// 1. Fix GameBoard.tsx
let gameBoardCode = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// Fix GAME OVER screen
const gameOverRegex = /<button \s*onClick=\{\(\) => window\.location\.reload\(\)\}\s*className="px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-all shadow-lg hover:scale-105"\s*>\s*Return to Lobby\s*<\/button>/s;

const gameOverReplace = `{myPlayer?.isHost ? (
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
              )}`;
              
gameBoardCode = gameBoardCode.replace(gameOverRegex, gameOverReplace);

// Remove custom-scrollbar from hand drawer and add hide-scrollbar
const drawerRegex = /className="flex \-space-x-8 hover:space-x-2 transition-all duration-300 px-4 max-w-6xl mx-auto items-center overflow-x-auto overflow-y-hidden h-full pt-16 pb-8 custom-scrollbar"/g;
gameBoardCode = gameBoardCode.replace(drawerRegex, 'className="flex -space-x-8 hover:space-x-2 transition-all duration-300 px-4 max-w-6xl mx-auto items-center overflow-x-auto h-full pt-16 pb-8 hide-scrollbar"');

// Ensure toast has mode="wait"
const toastRegex = /<AnimatePresence>\s*\{gameState\.lastActionMessage/s;
gameBoardCode = gameBoardCode.replace(toastRegex, '<AnimatePresence mode="wait">\n               {gameState.lastActionMessage');

fs.writeFileSync('src/components/GameBoard.tsx', gameBoardCode);

// 2. Fix index.css
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('hide-scrollbar')) {
    css += `\n.hide-scrollbar::-webkit-scrollbar { display: none; }\n.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }\n`;
    fs.writeFileSync('src/index.css', css);
}

console.log("Fixed UI");
