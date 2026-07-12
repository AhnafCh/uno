const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /while \(\(\!room\.players\[next\]\.connected && \!room\.players\[next\]\.isBot\) \|\| room\.players\[next\]\.eliminated\) \{\n\s*next = \(next \+ room\.direction \+ room\.players\.length\) % room\.players\.length;\n\s*\}/;

const replace = `let loopCount = 0;
    while (((!room.players[next].connected && !room.players[next].isBot) || room.players[next].eliminated) && loopCount < room.players.length) {
      next = (next + room.direction + room.players.length) % room.players.length;
      loopCount++;
    }`;

if (regex.test(code)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Fixed nextPlayerIndex infinite loop");
} else {
    console.log("No match");
}
