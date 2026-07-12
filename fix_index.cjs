const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// I accidentally replaced animate={{ opacity: 1, y: 0 }} globally before. Let's fix this specific one.
const badAnimate = `animate={{ opacity: 1, y: 0, transition: { delay: Math.min(index * 0.1, 0.5) } }}`;
code = code.replace(`animate={{ opacity: 1, y: 0, transition: { delay: Math.min(index * 0.1, 0.5) } }}\n                     exit={{ opacity: 0, scale: 0.9 }}`, `animate={{ opacity: 1, y: 0 }}\n                     exit={{ opacity: 0, scale: 0.9 }}`);
fs.writeFileSync('src/components/GameBoard.tsx', code);
