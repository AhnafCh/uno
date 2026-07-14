const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

// 1. Fix penalty stacking in normal mode
code = code.replace(
    /else if \(card\.value === 'draw2'\) \{\s*if \(room\.mode === 'no-mercy'\) room\.currentPenalty \+= 2;\s*else room\.currentPenalty = 2;\s*\}/g,
    "else if (card.value === 'draw2') {\n    room.currentPenalty += 2;\n  }"
);

code = code.replace(
    /else if \(card\.value === 'draw4'\) \{\s*if \(room\.mode === 'no-mercy'\) room\.currentPenalty \+= 4;\s*else room\.currentPenalty = 4;\s*\}/g,
    "else if (card.value === 'draw4') {\n    room.currentPenalty += 4;\n  }"
);

// 2. Remove early checkWinner in executePlayCard
code = code.replace(
    /room\.drawnCardThisTurn = null; \/\/ Clear draw state\s*room\.jumpInExpiry = Date\.now\(\) \+ 5000;\s*if \(checkWinner\(room, io\)\) return;/g,
    "room.drawnCardThisTurn = null; // Clear draw state\n  room.jumpInExpiry = Date.now() + 5000;"
);

// 3. Remove early checkWinner in executePlay7
code = code.replace(
    /room\.drawnCardThisTurn = null;\s*if \(checkWinner\(room, io\)\) return;\s*\/\/ Swap/g,
    "room.drawnCardThisTurn = null;\n\n   // Swap"
);

fs.writeFileSync('src/server/game.ts', code);
console.log("Patched game logic");
