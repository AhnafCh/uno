const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const regex = /<div className="text-\[10px\] font-bold bg-black\/40 px-2 py-0\.5 rounded uppercase">\s*\{p\.hand\.length\} CARDS\s*<\/div>/;
const replace = `<motion.div 
                  key={p.hand.length}
                  initial={{ scale: 1.5, color: '#eab308' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded uppercase"
                >
                  {p.hand.length} CARDS
                </motion.div>`;

code = code.replace(regex, replace);
fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Other players anim added");
