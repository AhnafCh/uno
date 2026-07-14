const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const targetStr = "} else if (canJumpIn) {\n                      isValid = true;\n                   }";
const insertStr = "} else if (canJumpIn) {\n                      isValid = true;\n                   }\n                   if (gameState.drawnCardThisTurn && card.id !== gameState.drawnCardThisTurn.id) {\n                      isValid = false;\n                   }";

if (code.includes(targetStr)) {
    code = code.replace(targetStr, insertStr);
    fs.writeFileSync('src/components/GameBoard.tsx', code);
    console.log("Patched GameBoard isValid");
} else {
    console.log("Could not find insert point");
}
