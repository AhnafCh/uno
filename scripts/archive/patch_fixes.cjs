const fs = require('fs');

// 1. Update useAudio.ts
let audioCode = fs.readFileSync('src/useAudio.ts', 'utf8');
audioCode = audioCode.replace("type: 'play' | 'draw' | 'uno' | 'error'", "type: 'play' | 'draw' | 'uno' | 'error' | 'turn'");
const errorCase = `      case 'error':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;`;
const turnCase = `      case 'turn':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.15);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;`;
if (!audioCode.includes("case 'turn':")) {
    audioCode = audioCode.replace(errorCase, errorCase + '\n' + turnCase);
}
fs.writeFileSync('src/useAudio.ts', audioCode);

// 2. Update GameBoard.tsx
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// Add horizontal wheel scroll
if (!gameBoard.includes('onWheel={(e)')) {
    gameBoard = gameBoard.replace(/<div className="flex -space-x-8 hover:space-x-2 transition-all duration-300 px-4 max-w-6xl mx-auto items-center overflow-x-auto h-full pt-16 pb-8 hide-scrollbar">/,
    `<div \n                 onWheel={(e) => { e.currentTarget.scrollLeft += e.deltaY; }} \n                 className="flex -space-x-8 hover:space-x-2 transition-all duration-300 px-4 max-w-6xl mx-auto items-center overflow-x-auto h-full pt-16 pb-8 hide-scrollbar">`);
}

// Ensure eliminated/finished players don't see Game Buttons
gameBoard = gameBoard.replace(/\{isMyTurn && gameState\.drawnCardThisTurn && !hidePassTurn && \(/,
'{isMyTurn && gameState.drawnCardThisTurn && !hidePassTurn && !myPlayer.eliminated && !myPlayer.hasFinished && (');

gameBoard = gameBoard.replace(/\{myPlayer\.hand\.length <= 2 && !myPlayer\.unoCalled && \(/,
'{myPlayer.hand.length > 0 && myPlayer.hand.length <= 2 && !myPlayer.unoCalled && !myPlayer.eliminated && !myPlayer.hasFinished && (');

gameBoard = gameBoard.replace(/<button \n                  onClick=\{() => socket\.emit\('sort_hand', gameState\.id\)\}/,
'{!myPlayer.eliminated && !myPlayer.hasFinished && <button \n                  onClick={() => socket.emit(\'sort_hand\', gameState.id)}');

// We have to close the sort hand button wrapper
if (!gameBoard.includes('</button>}')) {
    gameBoard = gameBoard.replace(/                  SORT HAND\n                <\/button>/,
    `                  SORT HAND\n                </button>}`);
}

// Increase center circle thickness
gameBoard = gameBoard.replace(/border-2 border-red-600 rounded-full/, 'border-[6px] border-red-600 rounded-full');

// Larger badge for number of cards
gameBoard = gameBoard.replace(/\{isMyTurn \? "YOUR TURN" : "WAITING\.\.\."\} \(\{myPlayer\.hand\.length\} CARDS\)/,
`{isMyTurn ? "YOUR TURN" : "WAITING..."} <span className="ml-2 bg-black/50 px-2 py-1 rounded text-white border border-white/20 text-xs shadow-md">{myPlayer.hand.length} CARDS</span>`);

// Add turn sound effect
const isMyTurnDecl = `const isMyTurn = gameState.currentPlayerIndex === myPlayerIndex && gameState.status === 'playing';`;
const turnSoundEffect = `  const prevTurn = useRef(false);
  useEffect(() => {
     if (isMyTurn && !prevTurn.current) {
         playSound('turn');
     }
     prevTurn.current = isMyTurn;
  }, [isMyTurn, playSound]);`;

if (!gameBoard.includes('playSound(\'turn\')')) {
    gameBoard = gameBoard.replace(isMyTurnDecl, isMyTurnDecl + '\n' + turnSoundEffect);
}

// Add Stagger animation to Hand
const motionDivSearch = `<motion.div 
                       key={card.id}
                       layoutId={card.id}
                       layout
                       initial={{ opacity: 0, y: 100, scale: 0.5 }}
                       animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, x: 0 }}`;

const motionDivReplace = `<motion.div 
                       key={card.id}
                       layoutId={card.id}
                       layout
                       initial={{ opacity: 0, y: 100, scale: 0.5 }}
                       animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, x: 0, transition: { delay: Math.min(index * 0.05, 0.5) } }}`;

if (!gameBoard.includes('Math.min(index * 0.05, 0.5)')) {
    gameBoard = gameBoard.replace(motionDivSearch, motionDivReplace);
}

fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
console.log("Patched GameBoard");
