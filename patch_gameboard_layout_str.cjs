const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const target1 = "className={`h-52 border-t flex items-center justify-center relative mt-auto z-40 transition-all duration-500 ${isMyTurn ? 'bg-[#15120a] border-yellow-500/50 shadow-[0_-15px_50px_rgba(234,179,8,0.15)]' : 'bg-[#08080a] border-white/10'}`}";
const repl1 = "className={`h-64 shrink-0 border-t flex items-center justify-center relative mt-auto z-40 transition-all duration-500 ${isMyTurn ? 'bg-[#15120a] border-yellow-500/50 shadow-[0_-15px_50px_rgba(234,179,8,0.15)]' : 'bg-[#08080a] border-white/10'}`}";
code = code.replace(target1, repl1);

const target2 = 'className="flex -space-x-8 hover:space-x-2 transition-all duration-300 px-8 w-full items-end overflow-x-auto h-full pt-12 pb-6 hide-scrollbar"';
const repl2 = 'className="flex -space-x-8 hover:space-x-2 transition-all duration-300 px-8 w-full items-center overflow-x-auto h-full pt-4 pb-0 hide-scrollbar"';
code = code.replace(target2, repl2);

const target3 = "className={`absolute left-1/2 -translate-x-1/2 px-6 py-2 rounded-full uppercase flex items-center gap-3 z-10 transition-all duration-300 shadow-2xl ${isMyTurn ? '-top-6 bg-yellow-500 text-black border-2 border-yellow-300 scale-110 shadow-yellow-500/50 font-black tracking-widest text-sm' : '-top-4 bg-[#0a0a0c] border border-white/10 text-[10px] font-bold text-white/40 tracking-widest'}`}";
const repl3 = "className={`absolute left-1/2 -translate-x-1/2 px-6 py-2 rounded-full uppercase flex items-center gap-3 z-[60] transition-all duration-300 shadow-2xl ${isMyTurn ? '-top-8 bg-yellow-500 text-black border-2 border-yellow-300 scale-110 shadow-yellow-500/50 font-black tracking-widest text-sm' : '-top-6 bg-[#0a0a0c] border border-white/10 text-[10px] font-bold text-white/40 tracking-widest'}`}";
code = code.replace(target3, repl3);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Patched gameboard layout string replacement");
