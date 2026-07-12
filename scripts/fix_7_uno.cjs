const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const play7SwapRegex = /const temp = p1\.hand;\n\s*p1\.hand = p2\.hand;\n\s*p2\.hand = temp;/;

const fixedPlay7Swap = `const temp = p1.hand;
   p1.hand = p2.hand;
   p2.hand = temp;
   if (p1.hand.length > 1) p1.unoCalled = false;
   if (p2.hand.length > 1) p2.unoCalled = false;`;

code = code.replace(play7SwapRegex, fixedPlay7Swap);
fs.writeFileSync('src/server/game.ts', code);
