const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const removePlayerEvent = `
    socket.on("remove_player", ({roomId, targetId}: {roomId: string, targetId: string}) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const player = room.players.find(p => p.id === socket.id);
      if (!player || !player.isHost) return;
      if (room.status !== 'lobby') return;
      
      const targetIndex = room.players.findIndex(p => p.id === targetId);
      if (targetIndex !== -1 && targetId !== socket.id) {
         room.players.splice(targetIndex, 1);
         io.to(roomId).emit("state_update", room);
      }
    });
`;

code = code.replace(/socket\.on\("add_bot"[\s\S]*?\}\);/m, "$&" + removePlayerEvent);
fs.writeFileSync('src/server/game.ts', code);
