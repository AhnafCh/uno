const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const logicStr = `
  let isDrawnCardPlayable = false;
  if (gameState.drawnCardThisTurn && myPlayer) {
      const card = gameState.drawnCardThisTurn;
      const topCard = gameState.discardPile[gameState.discardPile.length - 1];
      if (gameState.currentPenalty > 0 && gameState.stackingEnabled) {
          isDrawnCardPlayable = (topCard.value === 'draw4' && card.value === 'draw4') || 
                                (topCard.value === 'draw2' && (card.value === 'draw2' || card.value === 'draw4'));
      } else if (gameState.currentPenalty === 0) {
          isDrawnCardPlayable = card.color === gameState.currentColor || card.color === 'wild' || card.value === topCard.value;
      }
  }

  const hidePassTurn = gameState.forcePlayEnabled && isDrawnCardPlayable;
`;

code = code.replace(/  return \(\n    <div className="flex-1 flex flex-col/, logicStr + '\n  return (\n    <div className="flex-1 flex flex-col');

fs.writeFileSync('src/components/GameBoard.tsx', code);
