const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const targetStr = `   if (isTurn && room.drawnCardThisTurn && room.drawnCardThisTurn.id !== cardId) {
      socket?.emit("error", "You can only play the drawn card or pass");
      return;
   }`;

if (code.includes(targetStr)) {
    console.log("Found constraint block in play7");
    code = code.replace(targetStr, "");
} else {
    console.log("Could not find constraint block in play7");
}

fs.writeFileSync('src/server/game.ts', code);
