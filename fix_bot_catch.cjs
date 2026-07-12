const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const botCatchRegex = /const drawn = drawCards\(room, 2\);\n\s*p\.hand\.push\(\.\.\.drawn\);\n\s*room\.lastActionMessage = \`\$\{player\.name\} caught \$\{p\.name\} not saying UNO\! \+2 cards\`;\n\s*io\.to\(roomId\)\.emit\("state_update", room\);/;

code = code.replace(botCatchRegex, 
`const drawn = drawCards(room, 2);
          p.hand.push(...drawn);
          p.unoCalled = false;
          room.lastActionMessage = \`\${player.name} caught \${p.name} not saying UNO! +2 cards\`;
          checkEliminations(room, io);
          io.to(roomId).emit("state_update", room);`);

fs.writeFileSync('src/server/game.ts', code);
