const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

// Replace the duplicate lets.
// In the replacement block, I had:
// let playableCard: Card | undefined = undefined;
// let chosenColor: CardColor | undefined = undefined;
// let targetPlayerId: string | undefined = undefined;
// after the for loop.
const dup = `  }

  let playableCard: Card | undefined = undefined;
  let chosenColor: CardColor | undefined = undefined;
  let targetPlayerId: string | undefined = undefined;

  if (playableCards.length > 0) {`;

code = code.replace(dup, `  }

  if (playableCards.length > 0) {`);

fs.writeFileSync('src/server/game.ts', code);
