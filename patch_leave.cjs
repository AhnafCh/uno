const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const disconnectCode = `    socket.on("disconnect", () => {`;
const leaveCode = `    socket.on("leave_room", (roomId: string) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const player = room.players[playerIndex];
        player.connected = false;
        player.eliminated = true; // functionally eliminate them from the room
        socket.leave(roomId);
        room.lastActionMessage = \`\${player.name} left the room\`;
        
        if (room.players.every(p => (!p.connected && p.eliminated) || p.isBot)) {
           rooms.delete(roomId);
        } else {
           if (playerIndex === room.currentPlayerIndex && room.status === 'playing') {
               executeBotMove(roomId, io, true);
           }
           io.to(roomId).emit("state_update", { ...room, serverNow: Date.now() });
        }
      }
    });

    socket.on("disconnect", () => {`;

if (!code.includes('socket.on("leave_room"')) {
    code = code.replace(disconnectCode, leaveCode);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Added leave_room to server");
} else {
    console.log("leave_room already exists");
}
