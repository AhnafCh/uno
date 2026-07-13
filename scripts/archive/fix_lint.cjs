const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

gameBoard = gameBoard.replace(/!myPlayer\.hasFinished && /g, '');

fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
console.log("Fixed lint");
