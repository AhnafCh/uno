const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

code = code.replace(
  'interface Props {\n  gameState: GameState;\n  socketId: string;\n}',
  'interface Props {\n  gameState: GameState;\n  socketId: string;\n  onLeave?: () => void;\n}'
);

code = code.replace(
  'export default function GameBoard({ gameState, socketId }: Props) {',
  'export default function GameBoard({ gameState, socketId, onLeave }: Props) {'
);

const quitButtonOld = `<button onClick={() => window.location.reload()} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded text-xs font-bold transition-all text-white">
            QUIT
          </button>`;
          
const quitButtonNew = `<button onClick={() => {
            socket.emit('leave_room', gameState.id);
            if (onLeave) onLeave();
          }} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded text-xs font-bold transition-all text-white">
            RETURN TO LOBBY
          </button>`;

code = code.replace(quitButtonOld, quitButtonNew);
fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Updated GameBoard.tsx with Return to Lobby button");
