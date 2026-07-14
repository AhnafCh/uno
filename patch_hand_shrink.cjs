const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

code = code.replace(
    /className=\{\`relative transition-all cursor-pointer shadow-2xl \$\{\!isValid \&\& isMyTurn \? 'opacity-50 brightness-75 grayscale-\[20\%\]' : ''\} \$\{\!isValid \? 'pointer-events-none' : ''\}\`\}/g,
    "className={`relative shrink-0 transition-all cursor-pointer shadow-2xl ${!isValid && isMyTurn ? 'opacity-50 brightness-75 grayscale-[20%]' : ''} ${!isValid ? 'pointer-events-none' : ''}`}"
);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Patched hand cards to have shrink-0");
