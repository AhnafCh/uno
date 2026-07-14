const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const helperCode = `
function formatCardName(color, value) {
    const formattedColor = color.charAt(0).toUpperCase() + color.slice(1);
    let formattedValue = value.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
    formattedValue = formattedValue.replace(/([a-zA-Z])(\\d+)/g, '$1 $2');
    return \`\${formattedColor} \${formattedValue}\`;
}
`;

// Insert the helper function after imports
code = code.replace(/const COLORS: CardColor\[\] = \['red', 'blue', 'green', 'yellow'\];/, match => helperCode + '\n' + match);

const targetActionMsg = /room\.lastActionMessage = \`\$\{player\.name\} played \$\{card\.color \!== 'wild' \? card\.color : chosenColor\} \$\{card\.value\}\`;/;
const replacementActionMsg = `const displayColor = card.color !== 'wild' ? card.color : (chosenColor || 'wild');
  room.lastActionMessage = \`\${player.name} played \${formatCardName(displayColor, card.value)}\`;`;

if (code.match(targetActionMsg)) {
    console.log("Found lastActionMessage block");
    code = code.replace(targetActionMsg, replacementActionMsg);
} else {
    console.log("Could not find lastActionMessage block");
}

fs.writeFileSync('src/server/game.ts', code);
