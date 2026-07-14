const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

code = code.replace(
    /room\.players\.push\(\{[\s]*id: socket\.id,[\s]*name,[\s]*hand: \[\],[\s]*isHost: room\.players\.length === 0,[\s]*connected: true[\s]*\}\);/,
    `room.players.push({
          id: socket.id,
          name,
          hand: [],
          isHost: room.players.length === 0,
          connected: true,
          avatar: getUnusedAvatar(room)
        });`
);

fs.writeFileSync('src/server/game.ts', code);
console.log("Patched avatar in join_room");
