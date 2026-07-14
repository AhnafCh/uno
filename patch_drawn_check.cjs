const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const insertAfterStr = "const isStacking = room.currentPenalty > 0;";
const checkCode = `
  if (room.drawnCardThisTurn && card.id !== room.drawnCardThisTurn.id) {
      socket?.emit("error", "You can only play the drawn card.");
      return;
  }`;

if (code.includes(insertAfterStr)) {
    // There are multiple instances of "const isStacking", or actually just one in executePlayCard? Wait.
    // Let's replace the first occurance. Actually, executePlay7 doesn't have isStacking.
    code = code.replace("const isValidColor = card.color === room.currentColor || card.color === 'wild';", checkCode + "\n\n  const isValidColor = card.color === room.currentColor || card.color === 'wild';");
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Patched drawnCardThisTurn check");
} else {
    console.log("Could not find insert point");
}
