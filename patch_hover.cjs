const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const oldHover = `                       whileHover={isValid ? { y: -24, rotate: (index % 2 === 0 ? 3 : -2), zIndex: 50, scale: 1.05 } : {}}
                       className={\`relative shrink-0 transition-all cursor-pointer shadow-2xl \${!isValid && isMyTurn ? 'opacity-50 brightness-75 grayscale-[20%]' : ''} \${!isValid ? 'pointer-events-none' : ''}\`}`;

const newHover = `                       whileHover={{ y: -24, rotate: (index % 2 === 0 ? 3 : -2), zIndex: 50, scale: 1.05 }}
                       className={\`relative shrink-0 transition-all shadow-2xl \${!isValid && isMyTurn ? 'opacity-50 brightness-75 grayscale-[20%]' : ''} \${isValid ? 'cursor-pointer drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'cursor-default'}\`}`;

code = code.replace(oldHover, newHover);
fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Hover fixed");
