const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

code = code.replace(/if \(card && card\.value === '7' && gameState\.mode === 'no-mercy'\) \{/, "if (card && card.value === '7' && (gameState.mode === 'no-mercy' || gameState.rule70Enabled)) {");

fs.writeFileSync('src/components/GameBoard.tsx', code);
