const fs = require('fs');

let gameCode = fs.readFileSync('src/server/game.ts', 'utf-8');
const oldRestriction = `  if (room.drawnCardThisTurn && card.id !== room.drawnCardThisTurn.id) {
      socket?.emit("error", "You can only play the drawn card.");
      return;
  }`;
gameCode = gameCode.replace(oldRestriction, '');
fs.writeFileSync('src/server/game.ts', gameCode);

let boardCode = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');
const oldBoardRestriction = `                   if (gameState.drawnCardThisTurn && card.id !== gameState.drawnCardThisTurn.id) {
                      isValid = false;
                   }`;
boardCode = boardCode.replace(oldBoardRestriction, '');
fs.writeFileSync('src/components/GameBoard.tsx', boardCode);

console.log("Restrictions removed");
