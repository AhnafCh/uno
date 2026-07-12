const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const timerHook = `
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
     if (gameState.status !== 'playing' || !gameState.turnTimeLimit || !gameState.turnStartTime) {
         setTimeLeft(null);
         return;
     }
     
     const interval = setInterval(() => {
         const elapsed = (Date.now() - gameState.turnStartTime!) / 1000;
         const remaining = Math.max(0, gameState.turnTimeLimit! - Math.floor(elapsed));
         setTimeLeft(remaining);
     }, 500);
     return () => clearInterval(interval);
  }, [gameState.status, gameState.turnTimeLimit, gameState.turnStartTime]);
`;

code = code.replace(/const myPlayer = gameState\.players\[myPlayerIndex\];\n/, "const myPlayer = gameState.players[myPlayerIndex];\n" + timerHook);

const timerUI = `
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0a0a0c] border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2 z-10">
                {isMyTurn && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>}
                {isMyTurn ? "YOUR TURN" : "WAITING..."} ({myPlayer.hand.length} CARDS)
                {timeLeft !== null && (
                   <span className={\`ml-2 px-2 py-0.5 rounded \${timeLeft <= 5 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/10 text-white'}\`}>
                      {timeLeft}s
                   </span>
                )}
             </div>
`;

code = code.replace(/<div className="absolute -top-4 left-1\/2 -translate-x-1\/2 px-4 py-1 bg-\[#0a0a0c\] border border-white\/10 rounded-full text-\[10px\] font-bold text-white\/40 uppercase tracking-widest flex items-center gap-2 z-10">[\s\S]*?<\/div>/, timerUI);

fs.writeFileSync('src/components/GameBoard.tsx', code);
