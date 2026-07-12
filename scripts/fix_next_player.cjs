const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const nextPlayerRegex = /function nextPlayerIndex\(room: GameState, skipCount = 1\) \{\n\s*let next = room\.currentPlayerIndex;\n\s*for \(let i = 0; i < skipCount; i\+\+\) \{\n\s*next = \(next \+ room\.direction \+ room\.players\.length\) % room\.players\.length;\n\s*\/\/ skip disconnected \(but bots are always connected\)\n\s*while \(\(\!room\.players\[next\]\.connected && \!room\.players\[next\]\.isBot\) || room\.players\[next\]\.eliminated\) \{\n\s*next = \(next \+ room\.direction \+ room\.players\.length\) % room\.players\.length;\n\s*\}\n\s*\}\n\s*return next;\n\s*\}/;

const fixedNextPlayer = `function nextPlayerIndex(room: GameState, skipCount = 1) {
  let next = room.currentPlayerIndex;
  for (let i = 0; i < skipCount; i++) {
    next = (next + room.direction + room.players.length) % room.players.length;
    let loopCount = 0;
    while (((!room.players[next].connected && !room.players[next].isBot) || room.players[next].eliminated) && loopCount < room.players.length) {
      next = (next + room.direction + room.players.length) % room.players.length;
      loopCount++;
    }
  }
  return next;
}`;

code = code.replace(nextPlayerRegex, fixedNextPlayer);
fs.writeFileSync('src/server/game.ts', code);
