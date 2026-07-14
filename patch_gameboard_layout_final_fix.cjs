const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

code = code.replace(
    /className=\{\`absolute left-1\/2 -translate-x-1\/2 px-6 py-2 rounded-full uppercase flex items-center gap-3 z-10 transition-all duration-300 shadow-2xl \$\{isMyTurn \? '-top-6 bg-yellow-500 text-black border-2 border-yellow-300 scale-110 shadow-yellow-500\/50 font-black tracking-widest text-sm' : '-top-4 bg-\\[#0a0a0c\\] border border-white\/10 text-\\[10px\\] font-bold text-white\/40 tracking-widest'\}\`\}/g,
    "className={`absolute left-1/2 -translate-x-1/2 px-6 py-2 rounded-full uppercase flex items-center gap-3 z-[60] transition-all duration-300 shadow-2xl ${isMyTurn ? '-top-8 bg-yellow-500 text-black border-2 border-yellow-300 scale-110 shadow-yellow-500/50 font-black tracking-widest text-sm' : '-top-6 bg-[#0a0a0c] border border-white/10 text-[10px] font-bold text-white/40 tracking-widest'}`}"
);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Patched gameboard layout badge position");
