const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const targetNextPlayer = /function nextPlayerIndex\(room: GameState, skipCount = 1\) \{[\s\S]*?return next;\s*\}/;

const replacementNextPlayer = `function nextPlayerIndex(room: GameState, skipCount = 1) {
  // Prevent infinite loop if game is over or everyone is inactive
  const activePlayers = room.players.filter(p => !p.eliminated && !p.finishedPlace && (p.connected || p.isBot));
  if (activePlayers.length === 0) return room.currentPlayerIndex;

  let next = room.currentPlayerIndex;
  for (let i = 0; i < skipCount; i++) {
    do {
      next = (next + room.direction + room.players.length) % room.players.length;
    } while (room.players[next].eliminated || room.players[next].finishedPlace || (!room.players[next].connected && !room.players[next].isBot));
  }
  // Guarantee the next player is active even if skipCount was 0
  while (room.players[next].eliminated || room.players[next].finishedPlace || (!room.players[next].connected && !room.players[next].isBot)) {
      next = (next + room.direction + room.players.length) % room.players.length;
  }
  return next;
}`;

if (code.match(targetNextPlayer)) {
    console.log("Found nextPlayerIndex block");
    code = code.replace(targetNextPlayer, replacementNextPlayer);
    fs.writeFileSync('src/server/game.ts', code);
} else {
    console.log("Could not find nextPlayerIndex block");
}
