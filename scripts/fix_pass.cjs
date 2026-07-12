const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /if \(room\.drawnCardThisTurn\) \{\n\s*room\.drawnCardThisTurn = null;/;
const replace = `if (room.drawnCardThisTurn) {
            if (room.forcePlayEnabled) {
                const card = room.drawnCardThisTurn;
                const topCard = room.discardPile[room.discardPile.length - 1];
                let valid = false;
                const isStacking = room.currentPenalty > 0;
                if (isStacking && room.stackingEnabled) {
                   if (topCard.value === 'draw4' && card.value === 'draw4') valid = true;
                   if (topCard.value === 'draw2' && (card.value === 'draw2' || card.value === 'draw4')) valid = true;
                } else if (!isStacking) {
                   if (card.color === room.currentColor || card.color === 'wild' || card.value === topCard.value) valid = true;
                }
                if (valid) {
                    socket.emit("error", "You must play the drawn card (Force Play enabled)");
                    return;
                }
            }
            room.drawnCardThisTurn = null;`;

code = code.replace(regex, replace);
fs.writeFileSync('src/server/game.ts', code);
