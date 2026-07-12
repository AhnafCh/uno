const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const regex = /\{myPlayer\?\.eliminated \? \(\n\s*<div className="absolute inset-0 z-50 flex items-center justify-center bg-black\/80 backdrop-blur-sm">\n\s*<div className="text-center">\n\s*<Skull className="w-24 h-24 text-red-500 mx-auto mb-4 animate-bounce" \/>\n\s*<h2 className="text-4xl font-black text-red-500 tracking-tighter uppercase">Eliminated<\/h2>\n\s*<p className="text-white\/50 mt-2">You reached the card limit\.<\/p>\n\s*<\/div>\n\s*<\/div>\n\s*\) : \(/;
const replace = `{myPlayer?.eliminated && (
           <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-950/80 border border-red-500/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-2xl">
                <Skull className="w-6 h-6 text-red-500 animate-pulse" />
                <h2 className="text-lg font-black text-red-500 tracking-tighter uppercase">Eliminated</h2>
                <p className="text-white/50 text-sm">Spectating...</p>
           </div>
        )}
        (`;

code = code.replace(regex, replace);
fs.writeFileSync('src/components/GameBoard.tsx', code);
