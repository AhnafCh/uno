const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

code = code.replaceAll('now <= gameState.jumpInExpiry', 'Date.now() <= gameState.jumpInExpiry');

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Patched now -> Date.now()");
