const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

// 1. Change the outer container height to ensure it fits the cards + padding
code = code.replace(
    /className="h-\[240px\] md:h-\[280px\] bg-\[#141418\] border-t border-white\/10 flex items-end justify-center relative z-40"/g,
    'className="h-[280px] md:h-[300px] bg-[#141418] border-t border-white/10 flex items-end justify-center relative z-40"'
);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Patched gameboard layout height");
