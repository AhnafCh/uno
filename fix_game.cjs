const fs = require('fs');
let game = fs.readFileSync('src/server/game.ts', 'utf8');
game = game.replace("winner: null,", "winner: null,\n    winners: [],");
fs.writeFileSync('src/server/game.ts', game);
