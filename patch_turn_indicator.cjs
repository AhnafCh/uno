const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const oldBlock = `          {/* My Hand */}
          <div className="h-52 bg-[#08080a] border-t border-white/10 flex items-center justify-center relative mt-auto z-40">
             {myPlayer.eliminated && <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center"><span className="text-red-500 font-black text-6xl tracking-tighter shadow-2xl">ELIMINATED</span></div>}
             
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0a0a0c] border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 z-10">
                {isMyTurn && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>}
                {isMyTurn ? "YOUR TURN" : "WAITING..."} <span className="ml-2 bg-black/50 px-2 py-1 rounded text-white border border-white/20 text-xs shadow-md">{myPlayer.hand.length} CARDS</span>
                {timeLeft !== null && (
                   <span className={\`ml-2 px-2 py-0.5 rounded \${timeLeft <= 5 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/10 text-white'}\`}>
                      {timeLeft}s
                   </span>
                )}
             </div>`;

const newBlock = `          {/* My Hand */}
          <div className={\`h-52 border-t flex items-center justify-center relative mt-auto z-40 transition-all duration-500 \${isMyTurn ? 'bg-[#15120a] border-yellow-500/50 shadow-[0_-15px_50px_rgba(234,179,8,0.15)]' : 'bg-[#08080a] border-white/10'}\`}>
             {myPlayer.eliminated && <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center"><span className="text-red-500 font-black text-6xl tracking-tighter shadow-2xl">ELIMINATED</span></div>}
             
             <div className={\`absolute left-1/2 -translate-x-1/2 px-6 py-2 rounded-full uppercase flex items-center gap-3 z-10 transition-all duration-300 shadow-2xl \${isMyTurn ? '-top-6 bg-yellow-500 text-black border-2 border-yellow-300 scale-110 shadow-yellow-500/50 font-black tracking-widest text-sm' : '-top-4 bg-[#0a0a0c] border border-white/10 text-[10px] font-bold text-white/40 tracking-widest'}\`}>
                {isMyTurn && <div className="w-3 h-3 rounded-full bg-black animate-ping"></div>}
                {isMyTurn ? "YOUR TURN!" : "WAITING..."} <span className={\`ml-2 px-2 py-1 rounded text-xs shadow-md \${isMyTurn ? 'bg-black/20 text-black border border-black/20' : 'bg-black/50 text-white border border-white/20'}\`}>{myPlayer.hand.length} CARDS</span>
                {timeLeft !== null && (
                   <span className={\`ml-2 px-2 py-0.5 rounded \${timeLeft <= 5 ? 'bg-red-500 text-white font-bold animate-pulse' : (isMyTurn ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-white')}\`}>
                      {timeLeft}s
                   </span>
                )}
             </div>`;

if (code.includes(oldBlock)) {
    console.log("Found old block!");
    code = code.replace(oldBlock, newBlock);
    fs.writeFileSync('src/components/GameBoard.tsx', code);
} else {
    console.log("Could not find old block!");
}
