const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const emptyDeckRegex = /const drawn = drawCards\(room, 1\);\n\s*if \(drawn\.length > 0\) \{\n\s*player\.hand\.push\(drawn\[0\]\);\n\s*player\.unoCalled = false;\n\s*room\.drawnCardThisTurn = drawn\[0\];\n\s*room\.lastActionMessage = \`\$\{player\.name\} drew a card\`;\n\s*checkEliminations\(room, io\);\n\s*\}/;

const fixedEmptyDeck = `const drawn = drawCards(room, 1);
      if (drawn.length > 0) {
          player.hand.push(drawn[0]);
          player.unoCalled = false;
          room.drawnCardThisTurn = drawn[0];
          room.lastActionMessage = \`\${player.name} drew a card\`;
          checkEliminations(room, io);
      } else {
          room.lastActionMessage = \`No cards left! \${player.name} passed automatically.\`;
          room.currentPlayerIndex = nextPlayerIndex(room, 1);
          room.turnStartTime = Date.now();
      }`;

code = code.replace(emptyDeckRegex, fixedEmptyDeck);
fs.writeFileSync('src/server/game.ts', code);
