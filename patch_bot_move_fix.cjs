const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const targetStr = "function executeBotMove(roomId: string, io: Server) {\n  const room = rooms.get(roomId);\n  if (!room || room.status !== 'playing') return;\n\n  const playerIndex = room.currentPlayerIndex;\n  const player = room.players[playerIndex];\n  if (!player || !player.isBot) return;";
const replacementStr = "function executeBotMove(roomId: string, io: Server, forceAutoPlay: boolean = false) {\n  const room = rooms.get(roomId);\n  if (!room || room.status !== 'playing') return;\n\n  const playerIndex = room.currentPlayerIndex;\n  const player = room.players[playerIndex];\n  if (!player || (!player.isBot && !forceAutoPlay)) return;";

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    
    // Fix the calls to executeBotMove
    code = code.replace("room.lastActionMessage = `${player.name} ran out of time! Auto-playing...`;\n                   executeBotMove(roomId, io);", "room.lastActionMessage = `${player.name} ran out of time! Auto-playing...`;\n                   executeBotMove(roomId, io, true);");
    code = code.replace("room.lastActionMessage = `${player.name} disconnected! Auto-playing...`;\n                   executeBotMove(roomId, io);", "room.lastActionMessage = `${player.name} disconnected! Auto-playing...`;\n                   executeBotMove(roomId, io, true);");
    
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Patched executeBotMove fix");
} else {
    console.log("Could not find insert point");
}
