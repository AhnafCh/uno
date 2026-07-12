const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

// Inside executePlayCard, after applying penalty and before checking hands
let rule0Logic = `
  if (card.value === '0' && room.rule70Enabled) {
     const pCount = room.players.length;
     const newHands = [];
     for (let i = 0; i < pCount; i++) {
        const nextIdx = room.direction === 1 ? (i + 1) % pCount : (i - 1 + pCount) % pCount;
        newHands[nextIdx] = [...room.players[i].hand];
     }
     for (let i = 0; i < pCount; i++) {
        room.players[i].hand = newHands[i];
        // Reset UNO call state if they now have >1 cards
        if (room.players[i].hand.length > 1) {
            room.players[i].unoCalled = false;
        }
     }
     room.lastActionMessage = \`\${player.name} played a 0! All hands rotate.\`;
  }
`;

code = code.replace(/  if \(player\.hand\.length === 0\) \{/, rule0Logic + '\n  if (player.hand.length === 0) {');
fs.writeFileSync('src/server/game.ts', code);
