const fs = require('fs');

let types = fs.readFileSync('src/types.ts', 'utf8');
types = types.replace('lastPlayTime?: number;', 'jumpInExpiry?: number;');
fs.writeFileSync('src/types.ts', types);

let game = fs.readFileSync('src/server/game.ts', 'utf8');
game = game.replace(/room\.lastPlayTime = Date\.now\(\);/g, 'room.jumpInExpiry = Date.now() + 5000;');
game = game.replace(/room\.lastPlayTime = 0;/g, 'room.jumpInExpiry = 0;');
game = game.replace(/room\.lastPlayTime && Date\.now\(\) - room\.lastPlayTime <= 5000/g, 'room.jumpInExpiry && Date.now() <= room.jumpInExpiry');

fs.writeFileSync('src/server/game.ts', game);
