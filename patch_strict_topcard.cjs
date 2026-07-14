const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const targetStr = `  const isExactMatch = card.color === topCard.color && card.value === topCard.value && card.color !== 'wild' && (topCardId ? topCard.id === topCardId : true);`;

const replacementStr = `  if (topCardId && topCard.id !== topCardId) {
      socket?.emit("error", "Game state changed. Try again!");
      return;
  }

  const isExactMatch = card.color === topCard.color && card.value === topCard.value && card.color !== 'wild';`;

code = code.replace(targetStr, replacementStr);

const targetStr2 = `   const isExactMatch = card.color === topCard.color && card.value === topCard.value && card.color !== 'wild' && (topCardId ? topCard.id === topCardId : true);`;
const replacementStr2 = `   if (topCardId && topCard.id !== topCardId) {
      socket?.emit("error", "Game state changed. Try again!");
      return;
   }

   const isExactMatch = card.color === topCard.color && card.value === topCard.value && card.color !== 'wild';`;

code = code.replace(targetStr2, replacementStr2);

fs.writeFileSync('src/server/game.ts', code);
console.log("Patched strict topCardId");
