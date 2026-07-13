const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

gameBoard = gameBoard.replace(/Math\.min\(index \* 0\.05, 0\.5\)/g, 'Math.min(index * 0.1, 1.5)');

fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
console.log("Fixed delay");
