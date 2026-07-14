const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

// 1. Change the outer container height
code = code.replace(
    /className="h-48 md:h-56 bg-\[#141418\] border-t border-white\/10 flex items-end justify-center relative pb-0 z-40"/g,
    'className="h-[240px] md:h-[280px] bg-[#141418] border-t border-white/10 flex items-end justify-center relative z-40"'
);

// 2. Change the inner scroll container
code = code.replace(
    /className="flex -space-x-8 hover:space-x-2 transition-all duration-300 px-8 w-full items-center overflow-x-auto h-full pt-4 pb-0 hide-scrollbar"/g,
    'className="flex -space-x-8 hover:space-x-2 transition-all duration-300 px-8 w-full items-end overflow-x-auto h-full pt-12 pb-6 hide-scrollbar"'
);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Patched gameboard layout");
