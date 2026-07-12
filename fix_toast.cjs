const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// Move toast slightly lower so it doesn't overlap top players as easily
gameBoard = gameBoard.replace('<div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">', '<div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none">');

fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
