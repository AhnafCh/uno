const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const botCheckStr = `     if (room.drawnCardThisTurn) {
         if (card.id === room.drawnCardThisTurn.id) {
             valid = isCardPlayable(room, card, isStacking);
         }
     } else {
         valid = isCardPlayable(room, card, isStacking);
     }`;

if (code.includes(botCheckStr)) {
    console.log("Found bot check block");
    code = code.replace(botCheckStr, `     valid = isCardPlayable(room, card, isStacking);`);
} else {
    console.log("Could not find bot check block");
}

fs.writeFileSync('src/server/game.ts', code);
