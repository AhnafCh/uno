const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// Replace the win limit inputs
gameBoard = gameBoard.replace(/max=\{Math.max\(1, gameState\.players\.length - 1\)\}/g, 'max={9}');
gameBoard = gameBoard.replace(/Math\.min\(Math\.max\(1, gameState\.players\.length - 1\), \(gameState\.winLimit \|\| 1\) \+ 1\)/g, 'Math.min(9, (gameState.winLimit || 1) + 1)');

fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
console.log('Fixed limit UI');
