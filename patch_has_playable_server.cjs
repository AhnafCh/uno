const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const targetStr = "const hasPlayable = room.players[playerIndex].hand.some(c => isCardPlayable(room, c, room.currentPenalty > 0));";
const replacementStr = "const hasPlayable = room.players[playerIndex].hand.some(c => (room.drawnCardThisTurn ? c.id === room.drawnCardThisTurn.id : true) && isCardPlayable(room, c, room.currentPenalty > 0));";

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Patched server hasPlayable");
} else {
    console.log("Could not find insert point");
}
