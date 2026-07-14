const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

code = code.replace(
`                      if (gameState.drawnCardThisTurn) {
                          isValid = card.id === gameState.drawnCardThisTurn.id;
                      } else {
                          if (gameState.currentPenalty > 0 && gameState.stackingEnabled) {
                              if (gameState.mode === 'no-mercy') {
                                  const topDrawVal = getDrawValue(topCard.value);
                                  const playDrawVal = getDrawValue(card.value);
                                  isValid = topDrawVal > 0 && playDrawVal >= topDrawVal;
                              } else {
                                  isValid = (topCard.value === 'draw4' && card.value === 'draw4') ||
                                             (topCard.value === 'draw2' && (card.value === 'draw2' || card.value === 'draw4'));
                              }
                          } else if (gameState.currentPenalty === 0) {
                              isValid = card.color === gameState.currentColor || card.color === 'wild' || card.value === topCard.value;
                          }
                      }`,
`                      if (gameState.currentPenalty > 0 && gameState.stackingEnabled) {
                          if (gameState.mode === 'no-mercy') {
                              const topDrawVal = getDrawValue(topCard.value);
                              const playDrawVal = getDrawValue(card.value);
                              isValid = topDrawVal > 0 && playDrawVal >= topDrawVal;
                          } else {
                              isValid = (topCard.value === 'draw4' && card.value === 'draw4') ||
                                         (topCard.value === 'draw2' && (card.value === 'draw2' || card.value === 'draw4'));
                          }
                      } else if (gameState.currentPenalty === 0) {
                          isValid = card.color === gameState.currentColor || card.color === 'wild' || card.value === topCard.value;
                      }`
);

fs.writeFileSync('src/components/GameBoard.tsx', code);
