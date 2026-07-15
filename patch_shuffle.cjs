const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const addBot = `    socket.on("add_bot", (roomId: string) => {`;
const shuffleEvent = `    socket.on("shuffle_players", (roomId: string) => {
      const room = rooms.get(roomId);
      if (!room || room.status !== 'lobby') return;
      const player = room.players.find(p => p.id === socket.id);
      if (!player || !player.isHost) return;
      
      for (let i = room.players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [room.players[i], room.players[j]] = [room.players[j], room.players[i]];
      }
      io.to(roomId).emit("state_update", { ...room, serverNow: Date.now() });
    });

    socket.on("add_bot", (roomId: string) => {`;

code = code.replace(addBot, shuffleEvent);
fs.writeFileSync('src/server/game.ts', code);
console.log("Added shuffle_players event");
