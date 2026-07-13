const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// Replace canJumpIn declarations
gameBoard = gameBoard.replace(/const canJumpIn = gameState\.jumpInEnabled && !isMyTurn && isExactMatch && gameState\.currentPenalty === 0 && !gameState\.drawnCardThisTurn;/g, 
  'const canJumpIn = gameState.jumpInEnabled && !isMyTurn && isExactMatch && gameState.currentPenalty === 0 && !gameState.drawnCardThisTurn && (gameState.jumpInExpiry ? now <= gameState.jumpInExpiry : false);');

// Add visual indicator
const cardMarkup = '<PlayingCard card={card} />';
const replacement = `<PlayingCard card={card} />
                       {canJumpIn && (
                         <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-black text-xs px-2 py-1 rounded-full whitespace-nowrap shadow-lg border-2 border-yellow-700 z-50 flex flex-col items-center">
                           <span className="animate-pulse">JUMP IN!</span>
                           <span className="text-[9px]">{(Math.max(0, (gameState.jumpInExpiry - now) / 1000)).toFixed(1)}s</span>
                         </div>
                       )}`;
gameBoard = gameBoard.replace(cardMarkup, replacement);

fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
