const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

code = code.replace(/room.drawnCardThisTurn = null;(\s*\/\/\s*Swap)/, 'room.drawnCardThisTurn = null;\n   room.jumpInExpiry = Date.now() + 5000;$1');
fs.writeFileSync('src/server/game.ts', code);
console.log("Fixed jumpInExpiry in game.ts");
