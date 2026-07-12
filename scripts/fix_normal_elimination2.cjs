const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /room\.players\[nextIndex\]\.hand\.push\(\.\.\.drawn\);\n\s*room\.lastActionMessage \+= \` \(and \$\{room\.players\[nextIndex\]\.name\} drew \$\{room\.currentPenalty\}\)\`;\n\s*room\.currentPenalty = 0;\n\s*checkEliminations\(room, io\);\n\s*skip = 2;/;

const replace = `room.players[nextIndex].hand.push(...drawn);
      room.players[nextIndex].unoCalled = false;
      room.lastActionMessage += \` (and \${room.players[nextIndex].name} drew \${room.currentPenalty})\`;
      room.currentPenalty = 0;
      checkEliminations(room, io);
      skip = 2;`;

if (regex.test(code)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Fixed unoCalled");
} else {
    console.log("No match");
}
