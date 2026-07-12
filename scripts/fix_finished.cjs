const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const regex = /\{gameState\.status === 'lobby' \? \(/;
const replace = `{gameState.status === 'finished' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
           <div className="bg-neutral-900 border border-white/10 p-12 rounded-3xl shadow-2xl flex flex-col items-center max-w-lg w-full text-center">
              <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-yellow-600 drop-shadow-lg mb-4">
                 GAME OVER
              </h1>
              <div className="text-2xl font-medium text-white mb-8">
                 <span className="font-bold text-green-400">{gameState.winner}</span> won the game!
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-all shadow-lg hover:scale-105"
              >
                Return to Lobby
              </button>
           </div>
        </div>
      ) : gameState.status === 'lobby' ? (`;

if (regex.test(code)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/components/GameBoard.tsx', code);
    console.log("Added finished screen");
} else {
    console.log("No match");
}
