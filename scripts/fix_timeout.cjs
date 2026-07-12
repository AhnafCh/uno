const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const oldIntervalRegex = /setInterval\(\(\) => \{\n\s*rooms\.forEach\(\(room, roomId\) => \{\n\s*if \(room\.status === 'playing' && room\.turnTimeLimit && room\.turnTimeLimit > 0\) \{\n\s*if \(room\.turnStartTime && Date\.now\(\) - room\.turnStartTime > room\.turnTimeLimit \* 1000\) \{\n\s*\/\/ Timeout reached\n\s*const player = room\.players\[room\.currentPlayerIndex\];\n\s*if \(player && \!player\.isBot\) \{\n[\s\S]*?triggerBotIfTurn\(roomId, io\);\n\s*\}\n\s*\}\n\s*\}\n\s*\}\);\n\s*\}, 1000\);/;

const newInterval = `setInterval(() => {
    rooms.forEach((room, roomId) => {
        if (room.status === 'playing' && room.turnTimeLimit && room.turnTimeLimit > 0) {
            if (room.turnStartTime && Date.now() - room.turnStartTime > room.turnTimeLimit * 1000) {
                const player = room.players[room.currentPlayerIndex];
                if (player && !player.isBot) {
                   if (room.currentPenalty > 0) {
                      const drawn = drawCards(room, room.currentPenalty);
                      player.hand.push(...drawn);
                      room.currentPenalty = 0;
                      room.lastActionMessage = \`\${player.name} ran out of time and drew penalty cards!\`;
                   } else if (!room.drawnCardThisTurn) {
                      const drawn = drawCards(room, 1);
                      if (drawn.length > 0) player.hand.push(drawn[0]);
                      room.lastActionMessage = \`\${player.name} ran out of time and drew a card!\`;
                   } else {
                      room.lastActionMessage = \`\${player.name} ran out of time and passed!\`;
                   }
                   
                   room.drawnCardThisTurn = null;
                   player.unoCalled = false;
                   checkEliminations(room, io);
                   
                   if (room.status === 'playing') {
                       room.currentPlayerIndex = nextPlayerIndex(room, 1);
                       room.turnStartTime = Date.now();
                       io.to(roomId).emit("state_update", room);
                       triggerBotIfTurn(roomId, io);
                   }
                }
            }
        }
    });
  }, 1000);`;

code = code.replace(oldIntervalRegex, newInterval);
fs.writeFileSync('src/server/game.ts', code);
