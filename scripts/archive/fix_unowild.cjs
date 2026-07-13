const fs = require('fs');

// 1. GameBoard.tsx
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// Name changes
gameBoard = gameBoard.replace(/SCUFFED<span className="text-red-500">UNO<\/span>/g, 'UNO<span className="text-red-500">WILD</span>');
gameBoard = gameBoard.replace(/Scuffed<span className="text-red-500">UNO<\/span>/g, 'UNO<span className="text-red-500">WILD</span>');

// Thicker center circle
gameBoard = gameBoard.replace(/border-\[6px\] border-red-600 rounded-full/g, 'border-[12px] border-red-600 rounded-full');

// Animation for drawing cards (staggered and from deck direction)
// We replace the current animation props with ones that come from top (deck)
const motionSearch = /initial=\{\{ opacity: 0, y: 100, scale: 0\.5 \}\}\n\s*animate=\{\{ opacity: 1, y: 0, scale: 1, rotate: 0, x: 0, transition: \{ delay: Math\.min\(index \* 0\.1, 1\.5\) \} \}\}/g;
const motionReplace = `initial={{ opacity: 0, y: -300, scale: 0.2, x: 0 }}
                       animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, x: 0, transition: { type: "spring", stiffness: 200, damping: 20, delay: index > 0 ? (index % 5) * 0.15 : 0 } }}`;
gameBoard = gameBoard.replace(motionSearch, motionReplace);

fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);

// 2. Lobby.tsx
let lobby = fs.readFileSync('src/components/Lobby.tsx', 'utf8');
lobby = lobby.replace(/Scuffed<span className="text-red-500">UNO<\/span>/g, 'UNO<span className="text-red-500">WILD</span>');
lobby = lobby.replace(/SCUFFED<span className="text-red-500">UNO<\/span>/g, 'UNO<span className="text-red-500">WILD</span>');
fs.writeFileSync('src/components/Lobby.tsx', lobby);

// 3. index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/<title>Scuffed UNO<\/title>/, '<title>UNOWILD</title>');
fs.writeFileSync('index.html', indexHtml);

console.log("Fixed unowild, thicker circle, and card draw animations");
