const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const targetStr = `            if (room.forcePlayEnabled || room.mode === 'no-mercy') {
                const card = room.drawnCardThisTurn;
                let valid = isCardPlayable(room, card, room.currentPenalty > 0);
                if (valid) {
                    socket.emit("error", "You must play the drawn card.");
                    return;
                }
            }`;

const newStr = `            if (room.forcePlayEnabled || room.mode === 'no-mercy') {
                const hasPlayable = room.players[playerIndex].hand.some(c => isCardPlayable(room, c, room.currentPenalty > 0));
                if (hasPlayable) {
                    socket.emit("error", "You have playable cards.");
                    return;
                }
            }`;

if (code.includes(targetStr)) {
    console.log("Found pass block");
    code = code.replace(targetStr, newStr);
} else {
    console.log("Could not find pass block");
}

fs.writeFileSync('src/server/game.ts', code);
