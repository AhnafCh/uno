const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const disconnectRegex = /if \(room\.players\.findIndex\(p => p\.id === socket\.id\) === room\.currentPlayerIndex && room\.status === 'playing'\) \{\n\s*room\.currentPlayerIndex = nextPlayerIndex\(room, 1\);\n\s*room\.turnStartTime = Date\.now\(\);\n\s*\}/;

const fixedDisconnect = `if (room.players.findIndex(p => p.id === socket.id) === room.currentPlayerIndex && room.status === 'playing') {
               room.currentPlayerIndex = nextPlayerIndex(room, 1);
               room.turnStartTime = Date.now();
               // We will trigger bot later
               setTimeout(() => triggerBotIfTurn(roomId, io), 50); // slight delay to ensure state update goes first
             }`;

code = code.replace(disconnectRegex, fixedDisconnect);
fs.writeFileSync('src/server/game.ts', code);
