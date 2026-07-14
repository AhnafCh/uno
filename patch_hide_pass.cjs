const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const targetRegex = /let isDrawnCardPlayable = false;[\s\S]*?const hidePassTurn = \(gameState\.forcePlayEnabled \|\| gameState\.mode === 'no-mercy'\) && isDrawnCardPlayable;/;

const replacement = `  let hasPlayableCard = false;
  if (myPlayer) {
      const topCard = gameState.discardPile[gameState.discardPile.length - 1];
      hasPlayableCard = myPlayer.hand.some(card => {
          if (gameState.currentPenalty > 0 && gameState.stackingEnabled) {
              if (gameState.mode === 'no-mercy') {
                  const topDrawVal = getDrawValue(topCard.value);
                  const playDrawVal = getDrawValue(card.value);
                  return topDrawVal > 0 && playDrawVal >= topDrawVal;
              } else {
                  return (topCard.value === 'draw4' && card.value === 'draw4') ||
                         (topCard.value === 'draw2' && (card.value === 'draw2' || card.value === 'draw4'));
              }
          } else if (gameState.currentPenalty === 0) {
              return card.color === gameState.currentColor || card.color === 'wild' || card.value === topCard.value;
          }
          return false;
      });
  }

  const hidePassTurn = (gameState.forcePlayEnabled || gameState.mode === 'no-mercy') && hasPlayableCard;`;

if (code.match(targetRegex)) {
    console.log("Found hidePassTurn block");
    code = code.replace(targetRegex, replacement);
} else {
    console.log("Could not find hidePassTurn block");
}

fs.writeFileSync('src/components/GameBoard.tsx', code);
