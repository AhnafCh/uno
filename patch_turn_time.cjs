const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

code = code.replace(/room\.currentPlayerIndex = (.*?);/g, (match, p1) => {
    return `room.currentPlayerIndex = ${p1};\n  room.turnStartTime = Date.now();`;
});

// Fix jump in
code = code.replace(/room\.currentPlayerIndex = p1Idx;\n  room\.turnStartTime = Date\.now\(\);/g, `room.currentPlayerIndex = p1Idx;
      room.turnStartTime = Date.now();`);

// Let's also set turnStartTime when starting the game
code = code.replace(/room\.status = 'playing';/, `room.status = 'playing';\n      room.turnStartTime = Date.now();`);

fs.writeFileSync('src/server/game.ts', code);
