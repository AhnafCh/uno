const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

code = code.replaceAll('Date.now() <= gameState.jumpInExpiry', 'now <= gameState.jumpInExpiry');

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Patched Date.now() -> now");
