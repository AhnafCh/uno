const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const oldDisconnectRegex = /if \(room\.players\.findIndex\(p => p\.id === socket\.id\) === room\.currentPlayerIndex && room\.status === 'playing'\) \{\n\s*room\.currentPlayerIndex = nextPlayerIndex\(room, 1\);\n\s*room\.turnStartTime = Date\.now\(\);\n\s*\/\/ We will trigger bot later\n\s*setTimeout\(\(\) => triggerBotIfTurn\(roomId, io\), 50\); \/\/ slight delay to ensure state update goes first\n\s*\}/;

const newDisconnect = `const playerIndex = room.players.findIndex(p => p.id === socket.id);
             if (playerIndex === room.currentPlayerIndex && room.status === 'playing') {
                   if (room.currentPenalty > 0) {
                      const drawn = drawCards(room, room.currentPenalty);
                      player.hand.push(...drawn);
                      room.currentPenalty = 0;
                      room.lastActionMessage = \`\${player.name} disconnected and drew penalty cards!\`;
                   } else if (!room.drawnCardThisTurn) {
                      const drawn = drawCards(room, 1);
                      if (drawn.length > 0) player.hand.push(drawn[0]);
                      room.lastActionMessage = \`\${player.name} disconnected and drew a card!\`;
                   } else {
                      room.lastActionMessage = \`\${player.name} disconnected and passed!\`;
                   }
                   
                   room.drawnCardThisTurn = null;
                   player.unoCalled = false;
                   checkEliminations(room, io);
                   
                   if (room.status === 'playing') {
                       room.currentPlayerIndex = nextPlayerIndex(room, 1);
                       room.turnStartTime = Date.now();
                       setTimeout(() => triggerBotIfTurn(roomId, io), 50);
                   }
             }`;

code = code.replace(oldDisconnectRegex, newDisconnect);
fs.writeFileSync('src/server/game.ts', code);
