const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

// Restore the hand container to have shrink-0 so it never collapses, and make it h-60 (240px)
code = code.replace(
    /<div className=\{\`h-52 border-t flex items-center justify-center relative mt-auto z-40 transition-all duration-500 \$\{isMyTurn \? 'bg-\\[#15120a\\] border-yellow-500\\/50 shadow-\\[0_-15px_50px_rgba\\(234,179,8,0\\.15\\)\\]' : 'bg-\\[#08080a\\] border-white\\/10'\}\`\}>/g,
    "<div className={`h-64 shrink-0 border-t flex items-center justify-center relative mt-auto z-40 transition-all duration-500 ${isMyTurn ? 'bg-[#15120a] border-yellow-500/50 shadow-[0_-15px_50px_rgba(234,179,8,0.15)]' : 'bg-[#08080a] border-white/10'}`}>"
);

// Restore the scroll container
code = code.replace(
    /className="flex -space-x-8 hover:space-x-2 transition-all duration-300 px-8 w-full items-end overflow-x-auto h-full pt-12 pb-6 hide-scrollbar"/g,
    'className="flex -space-x-8 hover:space-x-2 transition-all duration-300 px-8 w-full items-center overflow-x-auto h-full pt-4 pb-0 hide-scrollbar"'
);

// Bring the badge slightly higher so it doesn't overlap hovered cards, and increase z-index just in case
code = code.replace(
    /className=\{\`absolute left-1\\/2 -translate-x-1\\/2 px-6 py-2 rounded-full uppercase flex items-center gap-3 z-10 transition-all duration-300 shadow-2xl \$\{isMyTurn \? '-top-6 bg-yellow-500/g,
    "className={`absolute left-1/2 -translate-x-1/2 px-6 py-2 rounded-full uppercase flex items-center gap-3 z-[60] transition-all duration-300 shadow-2xl ${isMyTurn ? '-top-8 bg-yellow-500"
);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Patched gameboard layout final");
