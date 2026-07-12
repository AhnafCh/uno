const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

// Fix executePlayCard
const regex1 = /room\.drawnCardThisTurn = null; \/\/ Clear draw state\n\n\s*\/\/ Apply card effects/;
const replace1 = `room.drawnCardThisTurn = null; // Clear draw state

  if (player.hand.length === 0) {
      room.status = 'finished';
      room.winner = player.name;
      io.to(roomId).emit("state_update", room);
      return;
  }

  // Apply card effects`;
code = code.replace(regex1, replace1);

// Fix executePlay7
const regex2 = /room\.currentColor = \(card\.color === 'wild' && chosenColor\) \? chosenColor : card\.color;\n\s*\/\/ Swap/;
const replace2 = `room.currentColor = (card.color === 'wild' && chosenColor) ? chosenColor : card.color;
   room.drawnCardThisTurn = null;
   
   if (p1.hand.length === 0) {
      room.status = 'finished';
      room.winner = p1.name;
      room.lastActionMessage = \`\${p1.name} played 7 as their last card and won!\`;
      io.to(roomId).emit("state_update", room);
      return;
   }
   
   // Swap`;
code = code.replace(regex2, replace2);

fs.writeFileSync('src/server/game.ts', code);
console.log("Fixed win conditions");
