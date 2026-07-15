const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  '<GameBoard gameState={gameState} socketId={socket.id || \'\'} />',
  '<GameBoard gameState={gameState} socketId={socket.id || \'\'} onLeave={() => setGameState(null)} />'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx with onLeave");
