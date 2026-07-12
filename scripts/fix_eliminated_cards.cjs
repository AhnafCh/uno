const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /p\.eliminated = true;\n\s*room\.lastActionMessage = \`\$\{p\.name\} was eliminated \(reached \$\{room\.eliminationLimit\} cards\)\!\`;/;
const replace = `p.eliminated = true;
      room.lastActionMessage = \`\${p.name} was eliminated (reached \${room.eliminationLimit} cards)!\`;
      // Return their hand to the bottom of the deck so cards aren't lost
      room.deck = [...p.hand, ...room.deck];
      p.hand = [];`;

code = code.replace(regex, replace);
fs.writeFileSync('src/server/game.ts', code);
