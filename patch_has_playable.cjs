const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const targetStr = "hasPlayableCard = myPlayer.hand.some(card => {";
const replacementStr = `hasPlayableCard = myPlayer.hand.some(card => {
          if (gameState.drawnCardThisTurn && card.id !== gameState.drawnCardThisTurn.id) return false;`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('src/components/GameBoard.tsx', code);
    console.log("Patched GameBoard hasPlayableCard");
} else {
    console.log("Could not find insert point");
}
