const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

// Header smaller on landscape
code = code.replace(/header className="h-14 /g, 'header className="h-10 md:h-14 ');

// My Hand wrapper smaller
code = code.replace(/<div className=\{\`h-64 /g, '<div className={`h-36 sm:h-48 md:h-64 ');

// Center Deck/Discard scaled
code = code.replace(/<div className="absolute top-1\/2 left-1\/2 -translate-x-1\/2 -translate-y-1\/2 flex items-center gap-12 z-10">/g, '<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] flex items-center gap-4 sm:gap-8 md:gap-12 z-10 scale-[0.55] sm:scale-75 md:scale-100">');

// Player Hand Cards scaled
code = code.replace(/<div\n\s*onWheel=\{\(e\)/g, '<div\n                  style={{ justifyContent: \'safe center\', perspective: \'1000px\' }}\n                  onWheel={(e)');
// Remove old style tag that was duplicated in the replace
code = code.replace(/style=\{\{ justifyContent: 'safe center' \}\}>/g, '>');

// Give the hand cards a responsive scale class
code = code.replace(/className=\{\`relative shrink-0 shadow-2xl /g, 'className={`relative shrink-0 shadow-2xl scale-[0.6] sm:scale-[0.8] md:scale-100 origin-bottom -mx-6 sm:-mx-4 md:mx-0 ');

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Fixed responsive");
