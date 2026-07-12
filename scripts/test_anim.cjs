const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

if (!code.includes('LayoutGroup')) {
  code = code.replace(/import \{ motion, AnimatePresence \} from 'motion\/react';/, "import { motion, AnimatePresence, LayoutGroup } from 'motion/react';");
}

code = code.replace(/<div className="flex-1 relative overflow-hidden flex flex-col">/, '<LayoutGroup>\n        <div className="flex-1 relative overflow-hidden flex flex-col">');
code = code.replace(/<\/div>\s*\{\/\* Color Picker Modal \*\/\}/, '</div>\n        </LayoutGroup>\n      {/* Color Picker Modal */}');

const discardRegex = /\{gameState\.discardPile\.slice\(-3\)\.map\(\(card, i, arr\) => \(\s*<div key=\{card\.id\} className=\{`absolute top-0 left-0 transition-all duration-300`\} style=\{\{\s*transform: `rotate\(\$\{\(i - arr\.length \+ 1\) \* 8 - 6\}deg\) translate\(\$\{\(i - arr\.length \+ 1\) \* 2\}px, \$\{\(i - arr\.length \+ 1\) \* 2\}px\)`,\s*zIndex: i\s*\}\}>\s*<PlayingCard card=\{card\} isCurrentColor=\{i === arr\.length - 1 \? gameState\.currentColor : undefined\} \/>\s*<\/div>\s*\)\}/;

const discardReplace = `{gameState.discardPile.slice(-3).map((card, i, arr) => (
                <motion.div 
                  key={card.id}
                  layoutId={card.id}
                  className="absolute top-0 left-0"
                  style={{ zIndex: i }}
                  initial={{ scale: 1.2, opacity: 0, rotate: Math.random() * 20 - 10 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    rotate: (i - arr.length + 1) * 8 - 6,
                    x: (i - arr.length + 1) * 2,
                    y: (i - arr.length + 1) * 2
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <PlayingCard card={card} isCurrentColor={i === arr.length - 1 ? gameState.currentColor : undefined} />
                </motion.div>
              ))}`;

code = code.replace(discardRegex, discardReplace);

const handRegex = /<motion\.div\s*key=\{card\.id\}\s*layout\s*initial=\{\{ opacity: 0, y: 50 \}\}\s*animate=\{\{ opacity: 1, y: 0 \}\}/;
const handReplace = `<motion.div
                       key={card.id}
                       layoutId={card.id}
                       layout
                       initial={{ opacity: 0, y: 100, scale: 0.5 }}
                       animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, x: 0 }}`;

code = code.replace(handRegex, handReplace);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log('Done');
