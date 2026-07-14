const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const targetStr = "const player = room.players[playerIndex];\n  if (!player) return;";
const replacementStr = "const player = room.players[playerIndex];\n  if (!player || !player.isBot) return;";

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Patched executeBotMove");
} else {
    console.log("Could not find insert point");
}
