const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// Wait, the logic block I injected for hidePassTurn is before the return statement. Let's check where it is.
const logic = code.match(/let isDrawnCardPlayable = false;[\s\S]*?const hidePassTurn = gameState.forcePlayEnabled && isDrawnCardPlayable;/);
if (!logic) {
  console.log("Logic not found!");
} else {
  console.log("Logic found at:", code.indexOf(logic[0]));
}
