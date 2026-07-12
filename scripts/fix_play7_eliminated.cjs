const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const p2CheckRegex = /const p2 = room\.players\[p2Idx\];/;
const fixedP2Check = `const p2 = room.players[p2Idx];
   if (p2.eliminated) {
      socket?.emit("error", "Cannot swap with eliminated player");
      return;
   }`;

code = code.replace(p2CheckRegex, fixedP2Check);
fs.writeFileSync('src/server/game.ts', code);
