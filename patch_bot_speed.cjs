const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

code = code.replace(/setTimeout\(\(\) => \{\n    executeBotMove\(roomId, io\);\n  \}, 1500\);/, "setTimeout(() => {\n    executeBotMove(roomId, io);\n  }, room.botSpeed || 1500);");

fs.writeFileSync('src/server/game.ts', code);
