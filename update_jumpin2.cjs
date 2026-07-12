const fs = require('fs');
let game = fs.readFileSync('src/server/game.ts', 'utf8');

game = game.replace(/const canJumpIn = room\.jumpInEnabled && !isTurn && isExactMatch && room\.currentPenalty === 0 && !room\.drawnCardThisTurn;/g, 
  'const canJumpIn = room.jumpInEnabled && !isTurn && isExactMatch && room.currentPenalty === 0 && !room.drawnCardThisTurn && room.lastPlayTime && Date.now() - room.lastPlayTime <= 5000;');

fs.writeFileSync('src/server/game.ts', game);
