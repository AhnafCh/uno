const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /if \(p1Idx === -1 \|\| p2Idx === -1 \|\| p1Idx !== room\.currentPlayerIndex\) return;\n\s*const p1 = room\.players\[p1Idx\];\n\s*const p2 = room\.players\[p2Idx\];\n\s*if \(p2\.eliminated\) \{\n\s*socket\?\.emit\("error", "Cannot swap with eliminated player"\);\n\s*return;\n\s*\}\n\s*const cardIndex = p1\.hand\.findIndex\(c => c\.id === cardId\);\n\s*if \(cardIndex === -1\) return;\n\s*const card = p1\.hand\[cardIndex\];\n\s*const topCard = room\.discardPile\[room\.discardPile\.length - 1\];\n\s*if \(card\.value !== '7'\) return;\n\s*if \(room\.currentPenalty > 0\) \{\n\s*socket\?\.emit\("error", "Cannot play 7 during a penalty stack"\);\n\s*return;\n\s*\}/;

const replace = `if (p1Idx === -1 || p2Idx === -1) return;
   const p1 = room.players[p1Idx];
   const p2 = room.players[p2Idx];
   if (p2.eliminated) {
      socket?.emit("error", "Cannot swap with eliminated player");
      return;
   }
   
   const isTurn = p1Idx === room.currentPlayerIndex;
   const cardIndex = p1.hand.findIndex(c => c.id === cardId);
   if (cardIndex === -1) return;
   const card = p1.hand[cardIndex];
   const topCard = room.discardPile[room.discardPile.length - 1];
   if (card.value !== '7') return;
   if (room.currentPenalty > 0) {
      socket?.emit("error", "Cannot play 7 during a penalty stack");
      return;
   }
   
   const isExactMatch = card.color === topCard.color && card.value === topCard.value && card.color !== 'wild';
   const canJumpIn = room.jumpInEnabled && !isTurn && isExactMatch && room.currentPenalty === 0 && !room.drawnCardThisTurn;

   if (!isTurn && !canJumpIn) {
      socket?.emit("error", "Not your turn");
      return;
   }
   if (isTurn && room.drawnCardThisTurn && room.drawnCardThisTurn.id !== cardId) {
      socket?.emit("error", "You can only play the drawn card or pass");
      return;
   }
   if (canJumpIn) {
      room.currentPlayerIndex = p1Idx;
      room.turnStartTime = Date.now();
      room.lastActionMessage = \`\${p1.name} jumped in!\`;
   }`;

if (regex.test(code)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/server/game.ts', code);
    console.log('Fixed executePlay7 jump in');
} else {
    console.log('Regex did not match');
}
