const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /p\.eliminated = true;\n\s*room\.discardPile\.push\(\.\.\.p\.hand\);\n\s*p\.hand = \[\];\n\s*anyEliminated = true;\n\s*room\.lastActionMessage = \`\$\{p\.name\} was eliminated \(Reached \$\{room\.eliminationLimit\} cards\)\!\`;/;

const replace = `p.eliminated = true;
            // Put cards at the bottom of the deck
            room.deck = [...p.hand, ...room.deck];
            p.hand = [];
            anyEliminated = true;
            room.lastActionMessage = \`\${p.name} was eliminated (Reached \${room.eliminationLimit} cards)!\`;`;

if (regex.test(code)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Fixed checkEliminations");
} else {
    console.log("No match");
}
