const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const regex = /if \(gameState\.drawnCardThisTurn\) \{[\s\S]*?isValid = card\.id === gameState\.drawnCardThisTurn\.id;[\s\S]*?\} else \{([\s\S]*?)\} \/\/ else for drawnCard/g;

// Instead of regex, I'll just use string replacement carefully
const part1 = "if (gameState.drawnCardThisTurn) {";
const part2 = "isValid = card.id === gameState.drawnCardThisTurn.id;";
const part3 = "} else {";

if (code.includes(part1)) {
    console.log("Found part1");
    // Just replace the block using regex
    code = code.replace(/if \(gameState\.drawnCardThisTurn\) \{\s*isValid = card\.id === gameState\.drawnCardThisTurn\.id;\s*\} else \{\s*(if \(gameState\.currentPenalty > 0 && gameState\.stackingEnabled\) \{[\s\S]*?\} else if \(gameState\.currentPenalty === 0\) \{[\s\S]*?\})\s*\}/g, '$1');
}

fs.writeFileSync('src/components/GameBoard.tsx', code);
