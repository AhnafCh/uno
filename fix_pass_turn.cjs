const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const oldPassTurnRegex = /socket\.on\("pass_turn", \(roomId: string\) => \{\n\s*const room = rooms\.get\(roomId\);\n\s*if \(\!room || room\.status \!\=\= 'playing'\) return;\n\s*const playerIndex = room\.players\.findIndex\(p => p\.id === socket\.id\);\n\s*if \(playerIndex === -1 || playerIndex \!\=\= room\.currentPlayerIndex\) return;\n\s*if \(room\.drawnCardThisTurn\) \{\n\s*room\.drawnCardThisTurn = null;\n\s*room\.currentPlayerIndex = nextPlayerIndex\(room, 1\);\n\s*room\.turnStartTime = Date\.now\(\);\n\s*room\.lastActionMessage = \`\$\{room\.players\[playerIndex\]\.name\} passed\.\`;\n\s*io\.to\(roomId\)\.emit\("state_update", room\);\n\s*triggerBotIfTurn\(roomId, io\);\n\s*\}\n\s*\}\);/;

const newPassTurn = `socket.on("pass_turn", (roomId: string) => {
        const room = rooms.get(roomId);
        if (!room || room.status !== 'playing') return;
        const playerIndex = room.players.findIndex(p => p.id === socket.id);
        if (playerIndex === -1 || playerIndex !== room.currentPlayerIndex) return;
        if (room.drawnCardThisTurn) {
            if (room.forcePlayEnabled) {
                const card = room.drawnCardThisTurn;
                const topCard = room.discardPile[room.discardPile.length - 1];
                const isStacking = room.currentPenalty > 0;
                let valid = false;
                if (isStacking) {
                   if (room.stackingEnabled) {
                      if (topCard.value === 'draw4' && card.value === 'draw4') valid = true;
                      if (topCard.value === 'draw2' && (card.value === 'draw2' || card.value === 'draw4')) valid = true;
                   }
                } else {
                   if (card.color === room.currentColor || card.color === 'wild' || card.value === topCard.value) valid = true;
                }
                if (valid) {
                    socket?.emit("error", "Force Play is enabled. You must play the drawn card.");
                    return;
                }
            }
            room.drawnCardThisTurn = null;
            room.currentPlayerIndex = nextPlayerIndex(room, 1);
            room.turnStartTime = Date.now();
            room.lastActionMessage = \`\${room.players[playerIndex].name} passed.\`;
            io.to(roomId).emit("state_update", room);
            triggerBotIfTurn(roomId, io);
        }
    });`;

code = code.replace(oldPassTurnRegex, newPassTurn);
fs.writeFileSync('src/server/game.ts', code);
