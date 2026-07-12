const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

code = code.replace(/animate=\{\{ opacity: 1, y: 0 \}\}/, "animate={{ opacity: 1, y: 0, transition: { delay: Math.min(index * 0.1, 0.5) } }}");

fs.writeFileSync('src/components/GameBoard.tsx', code);
