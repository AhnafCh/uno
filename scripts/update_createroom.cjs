const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

code = code.replace(/eliminationLimit: mode === 'no-mercy' \? 25 : 0,/, "eliminationLimit: 20,");

fs.writeFileSync('src/server/game.ts', code);
