const fs = require('fs');
let game = fs.readFileSync('src/server/game.ts', 'utf8');

game = game.replace(/function checkWinner\(room: GameState, io: Server\): boolean \{[\s\S]*?return false;\n\}/, `function checkWinner(room: GameState, io: Server): boolean {
    const activePlayers = room.players.filter(p => !p.eliminated && !p.finishedPlace && (p.connected || p.isBot));
    
    // Check if any active player just finished their hand
    let justFinished = false;
    for (const p of room.players) {
        if (!p.eliminated && !p.finishedPlace && p.hand.length === 0) {
            const place = (room.winners?.length || 0) + 1;
            p.finishedPlace = place;
            if (!room.winners) room.winners = [];
            room.winners.push({ name: p.name, place });
            if (!room.winner) room.winner = p.name; // Keep first place winner here for backward compatibility
            room.lastActionMessage = \`\${p.name} finished in \${place}\${place===1?'st':place===2?'nd':place===3?'rd':'th'} place!\`;
            justFinished = true;
        }
    }
    
    const remainingActive = room.players.filter(p => !p.eliminated && !p.finishedPlace && (p.connected || p.isBot));
    
    if (remainingActive.length <= 1 && room.players.length > 1) {
        if (remainingActive.length === 1) {
             const p = remainingActive[0];
             const place = (room.winners?.length || 0) + 1;
             p.finishedPlace = place;
             if (!room.winners) room.winners = [];
             room.winners.push({ name: p.name, place });
        }
        room.status = 'finished';
        io.to(room.id).emit("state_update", room);
        return true;
    }
    
    if (justFinished) {
         // Emit state update if someone just finished but game is not over
         io.to(room.id).emit("state_update", room);
    }
    
    return false;
}`);

// Also we need to fix nextPlayerIndex to skip players who have finished
game = game.replace(/function nextPlayerIndex\(room: GameState, skipCount = 1\) \{[\s\S]*?\n\}/, `function nextPlayerIndex(room: GameState, skipCount = 1) {
  let next = room.currentPlayerIndex;
  for (let i = 0; i < skipCount; i++) {
    do {
      next = (next + room.direction + room.players.length) % room.players.length;
    } while (room.players[next].eliminated || room.players[next].finishedPlace || (!room.players[next].connected && !room.players[next].isBot));
  }
  return next;
}`);

// Check where room.status = 'finished' is explicitly set
game = game.replace(/if \(player\.hand\.length === 0\) \{\s*room\.status = 'finished';\s*room\.winner = player\.name;\s*io\.to\(roomId\)\.emit\("state_update", room\);\s*return;\s*\}/g, `if (checkWinner(room, io)) return;`);

game = game.replace(/if \(p1\.hand\.length === 0\) \{\s*room\.status = 'finished';\s*room\.winner = p1\.name;\s*room\.lastActionMessage = \`\${p1\.name} played 7 as their last card and won!\`;\s*io\.to\(roomId\)\.emit\("state_update", room\);\s*return;\s*\}/, `if (checkWinner(room, io)) return;`);

game = game.replace(/if \(p2\.hand\.length === 0\) \{\s*room\.status = 'finished';\s*room\.winner = p2\.name;\s*\}/, `if (checkWinner(room, io)) return;`);

// Reset winners in play_again
game = game.replace(`room.winner = undefined;`, `room.winner = undefined;\n        room.winners = [];`);
game = game.replace(`eliminated: false,`, `eliminated: false,\n            finishedPlace: undefined,`);


fs.writeFileSync('src/server/game.ts', game);
console.log('Fixed endgame logic');
