const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

code = code.replace(/if \(!room \|\| room\.status !== 'playing' \|\| room\.mode !== 'no-mercy'\) return;/, "if (!room || room.status !== 'playing') return;\n       if (room.mode !== 'no-mercy' && !room.rule70Enabled) return;");

fs.writeFileSync('src/server/game.ts', code);
