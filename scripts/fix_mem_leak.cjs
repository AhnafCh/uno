const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const memLeakRegex = /if \(room\.players\.every\(p => \!p\.connected\)\) \{\n\s*rooms\.delete\(roomId\); \/\/ Clean up empty room\n\s*\} else \{/;

const fixMemLeak = `if (room.players.every(p => !p.connected || p.isBot)) {
            rooms.delete(roomId); // Clean up empty room if no humans left
          } else {`;

code = code.replace(memLeakRegex, fixMemLeak);
fs.writeFileSync('src/server/game.ts', code);
