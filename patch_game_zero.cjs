const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

code = code.replace(/else if \(room\.mode === 'no-mercy' && card\.value === '0'\) \{/, "else if ((room.mode === 'no-mercy' || room.rule70Enabled) && card.value === '0') {");

fs.writeFileSync('src/server/game.ts', code);
