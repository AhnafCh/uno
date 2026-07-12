const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /room\.players\[nextIndex\]\.unoCalled = false;\n\s*room\.lastActionMessage \+= \` \(and \$\{room\.players\[nextIndex\]\.name\} drew \$\{room\.currentPenalty\}\)\`;\n\s*room\.currentPenalty = 0;\n\s*checkEliminations\(room, io\);\n\s*skip = 2;/;

const replace = `room.players[nextIndex].unoCalled = false;
      room.lastActionMessage += \` (and \${room.players[nextIndex].name} drew \${room.currentPenalty})\`;
      room.currentPenalty = 0;
      checkEliminations(room, io);
      room.currentPlayerIndex = nextIndex;
      skip = 1;`;

if (regex.test(code)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Fixed skip logic after draw");
} else {
    console.log("No match");
}
