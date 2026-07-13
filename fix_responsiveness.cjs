const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const oldAngles = `              if (N > 1) {
                 const startAngle = Math.PI * 1.12;
                 const endAngle = -Math.PI * 0.12;
                 angle = startAngle - (i / (N - 1)) * (startAngle - endAngle);
              }
              
              // Oval bounds
              const top = 46 - Math.sin(angle) * 31; // %
              const left = 50 + Math.cos(angle) * 44; // %`;

const newAngles = `              if (N > 1) {
                 const startAngle = Math.PI * 1.05;
                 const endAngle = -Math.PI * 0.05;
                 angle = startAngle - (i / (N - 1)) * (startAngle - endAngle);
              }
              
              // Oval bounds
              const top = 38 - Math.sin(angle) * 20; // %
              const left = 50 + Math.cos(angle) * 38; // %`;

gameBoard = gameBoard.replace(oldAngles, newAngles);

fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
console.log('Fixed opponent player bounds');
