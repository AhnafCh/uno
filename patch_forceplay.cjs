const fs = require('fs');

let gameCode = fs.readFileSync('src/server/game.ts', 'utf-8');
const oldPassCheck = `                const hasPlayable = room.players[playerIndex].hand.some(c => (room.drawnCardThisTurn ? c.id === room.drawnCardThisTurn.id : true) && isCardPlayable(room, c, room.currentPenalty > 0));`;
const newPassCheck = `                const hasPlayable = room.players[playerIndex].hand.some(c => isCardPlayable(room, c, room.currentPenalty > 0));`;
gameCode = gameCode.replace(oldPassCheck, newPassCheck);
fs.writeFileSync('src/server/game.ts', gameCode);

console.log("Force play check updated");
