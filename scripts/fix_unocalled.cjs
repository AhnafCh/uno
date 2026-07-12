const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /player\.hand\.splice\(cardIndex, 1\);\n\s*room\.discardPile\.push\(card\);\n\s*room\.currentColor = \(card\.color === 'wild' && chosenColor\) \? chosenColor : card\.color;\n\s*room\.lastActionMessage = \`\$\{player\.name\} played \$\{card\.color \!\=\= 'wild' \? card\.color : chosenColor\} \$\{card\.value\}\`;\n\s*room\.drawnCardThisTurn = null;/;

const replace = `player.hand.splice(cardIndex, 1);
  if (player.hand.length > 1) player.unoCalled = false;
  room.discardPile.push(card);
  room.currentColor = (card.color === 'wild' && chosenColor) ? chosenColor : card.color;
  room.lastActionMessage = \`\${player.name} played \${card.color !== 'wild' ? card.color : chosenColor} \${card.value}\`;
  room.drawnCardThisTurn = null;`;

if (regex.test(code)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Fixed unoCalled reset on play");
} else {
    console.log("No match");
}
