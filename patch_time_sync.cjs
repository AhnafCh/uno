const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

code = code.replace(/io\.to\(roomId\)\.emit\("state_update", room\);/g, 'io.to(roomId).emit("state_update", { ...room, serverNow: Date.now() });');

fs.writeFileSync('src/server/game.ts', code);
console.log("Fixed state_update to include serverNow");
