const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /\/\/ Global turn timeout checker[\s\S]*/;
code = code.replace(regex, '');

const setupGameRegex = /(export function setupGame\(io: Server\) \{)/;
const timeoutLogic = `
  setInterval(() => {
    rooms.forEach((room, roomId) => {
        if (room.status === 'playing' && room.turnTimeLimit && room.turnTimeLimit > 0) {
            if (room.turnStartTime && Date.now() - room.turnStartTime > room.turnTimeLimit * 1000) {
                // Timeout reached
                const player = room.players[room.currentPlayerIndex];
                if (player && !player.isBot) {
                   room.drawnCardThisTurn = null;
                   room.currentPlayerIndex = nextPlayerIndex(room, 1);
                   room.turnStartTime = Date.now();
                   room.lastActionMessage = \`\${player.name} ran out of time and passed!\`;
                   io.to(roomId).emit("state_update", room);
                   triggerBotIfTurn(roomId, io);
                }
            }
        }
    });
  }, 1000);
`;

code = code.replace(setupGameRegex, "$1" + timeoutLogic);
fs.writeFileSync('src/server/game.ts', code);
