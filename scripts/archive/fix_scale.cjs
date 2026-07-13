const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const oldMapStart = `            {otherPlayers.map((p, i) => {
              const N = otherPlayers.length;
              let angle = Math.PI / 2; // Default to top if only 1 player
              if (N > 1) {
                 const startAngle = Math.PI * 1.12;
                 const endAngle = -Math.PI * 0.12;
                 angle = startAngle - (i / (N - 1)) * (startAngle - endAngle);
              }
              
              // Oval bounds
              const top = 46 - Math.sin(angle) * 31; // %
              const left = 50 + Math.cos(angle) * 44; // %
              
              const isCurrentTurn = gameState.players[gameState.currentPlayerIndex]?.id === p.id;
              
              return (
                <div 
                  key={p.id} 
                  className={\`absolute flex flex-col items-center justify-center transition-all duration-700 ease-out \${!p.connected ? 'opacity-50' : 'opacity-100'} \${isCurrentTurn ? 'scale-110 z-20' : 'scale-100 z-10'} pointer-events-auto\`}
                  style={{ top: \`\${top}%\`, left: \`\${left}%\`, transform: 'translate(-50%, -50%)' }}
                >`;

const newMapStart = `            {otherPlayers.map((p, i) => {
              const N = otherPlayers.length;
              let angle = Math.PI / 2; // Default to top if only 1 player
              if (N > 1) {
                 const startAngle = Math.PI * 1.12;
                 const endAngle = -Math.PI * 0.12;
                 angle = startAngle - (i / (N - 1)) * (startAngle - endAngle);
              }
              
              // Oval bounds
              const top = 46 - Math.sin(angle) * 31; // %
              const left = 50 + Math.cos(angle) * 44; // %
              
              const isCurrentTurn = gameState.players[gameState.currentPlayerIndex]?.id === p.id;
              
              let baseScale = 1;
              if (N <= 2) baseScale = 1.4;
              else if (N === 3) baseScale = 1.25;
              else if (N === 4) baseScale = 1.1;
              else if (N >= 5) baseScale = 0.9;
              
              const finalScale = isCurrentTurn ? baseScale * 1.15 : baseScale;
              
              return (
                <div 
                  key={p.id} 
                  className={\`absolute flex flex-col items-center justify-center transition-all duration-700 ease-out \${!p.connected ? 'opacity-50' : 'opacity-100'} \${isCurrentTurn ? 'z-20' : 'z-10'} pointer-events-auto\`}
                  style={{ top: \`\${top}%\`, left: \`\${left}%\`, transform: \`translate(-50%, -50%) scale(\${finalScale})\` }}
                >`;

gameBoard = gameBoard.replace(oldMapStart, newMapStart);
fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
console.log('Fixed scale');
