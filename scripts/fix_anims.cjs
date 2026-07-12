const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// Add LayoutGroup to imports if missing
if (!code.includes('LayoutGroup')) {
  code = code.replace(/import \{ motion, AnimatePresence \} from 'motion\/react';/, "import { motion, AnimatePresence, LayoutGroup } from 'motion/react';");
}

// Ensure LayoutGroup wrapper
if (!code.includes('<LayoutGroup>')) {
  code = code.replace(/<div className="flex-1 relative overflow-hidden flex flex-col">/g, '<LayoutGroup>\n        <div className="flex-1 relative overflow-hidden flex flex-col">');
  code = code.replace(/<\/div>\s*\{\/\* Color Picker Modal \*\/\}/g, '</div>\n        </LayoutGroup>\n      {/* Color Picker Modal */}');
}

// 1. Replace Discard Pile
const startDiscard = code.indexOf('{gameState.discardPile.slice(-3).map((card, i, arr) => (');
if (startDiscard !== -1) {
  const endDiscard = code.indexOf('</div>\n              ))}', startDiscard) + '</div>\n              ))}'.length;
  
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
  
  code = code.substring(0, startDiscard) + discardReplace + code.substring(endDiscard);
} else {
  console.log("Could not find startDiscard");
}

// 2. Replace Hand Card
const handCode = `                     <motion.div
                       key={card.id}
                       layout
                       initial={{ opacity: 0, y: 50 }}
                       animate={{ opacity: 1, y: 0 }}`;
const handReplaceCode = `                     <motion.div
                       key={card.id}
                       layoutId={card.id}
                       layout
                       initial={{ opacity: 0, y: 100, scale: 0.5 }}
                       animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, x: 0 }}`;
code = code.replace(handCode, handReplaceCode);

// Optional: also animate other players playing cards (they don't have layoutIds but they can jump)
// Or drawing cards from Deck?

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Applied animations");
