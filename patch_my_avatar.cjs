const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const targetMyRegex = /<div className=\{\`absolute left-1\/2 -translate-x-1\/2 px-6 py-2 rounded-full uppercase flex items-center gap-3 z-10 transition-all duration-300 shadow-2xl \$\{isMyTurn \? '-top-6 bg-yellow-500 text-black border-2 border-yellow-300 scale-110 shadow-yellow-500\/50 font-black tracking-widest text-sm' : '-top-4 bg-\[\#0a0a0c\] border border-white\/10 text-\[10px\] font-bold text-white\/40 tracking-widest'\}\`\}>/;
const replacementMy = `<div className={\`absolute left-1/2 -translate-x-1/2 px-6 py-2 rounded-full uppercase flex items-center gap-3 z-10 transition-all duration-300 shadow-2xl \${isMyTurn ? '-top-6 bg-yellow-500 text-black border-2 border-yellow-300 scale-110 shadow-yellow-500/50 font-black tracking-widest text-sm' : '-top-4 bg-[#0a0a0c] border border-white/10 text-[10px] font-bold text-white/40 tracking-widest'}\`}>
                <div className={\`w-8 h-8 rounded-full overflow-hidden bg-black/20 flex items-center justify-center \${isMyTurn ? 'border-2 border-black/30' : 'border border-white/10'}\`}>
                    {myPlayer.avatar ? <img src={myPlayer.avatar} alt={myPlayer.name} className="w-full h-full object-cover" /> : <span>{myPlayer.name.substring(0,2).toUpperCase()}</span>}
                </div>`;

if (code.match(targetMyRegex)) {
    console.log("Found my avatar block");
    code = code.replace(targetMyRegex, replacementMy);
} else {
    console.log("Could not find my avatar block");
}

fs.writeFileSync('src/components/GameBoard.tsx', code);
