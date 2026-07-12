const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /if \(\!isStacking && room\.currentPenalty > 0 && room\.mode === 'normal'\) \{/;
const replace = `if (!isStacking && !room.stackingEnabled && room.currentPenalty > 0 && room.mode === 'normal') {`;

code = code.replace(regex, replace);
fs.writeFileSync('src/server/game.ts', code);
