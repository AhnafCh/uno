const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

code = code.replace(
    /function executeDrawCard\(roomId: string, io: Server, playerIndex: number\) \{\s*const room = rooms\.get\(roomId\);\s*if \(!room \|\| room\.status \!== 'playing'\) return;\s*if \(playerIndex \!== room\.currentPlayerIndex\) return;\s*if \(room\.drawnCardThisTurn\) return; \/\/ Already drawn/,
    "function executeDrawCard(roomId: string, io: Server, playerIndex: number) {\n  const room = rooms.get(roomId);\n  if (!room || room.status !== 'playing') return;\n  if (playerIndex !== room.currentPlayerIndex) return;\n  if (room.drawnCardThisTurn) return; // Already drawn\n\n  room.jumpInExpiry = 0;"
);

fs.writeFileSync('src/server/game.ts', code);
console.log("Patched executeDrawCard jumpInExpiry");
