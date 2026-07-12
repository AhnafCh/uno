const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const regex = /initial=\{\{ opacity: 0, y: 100, scale: 0.5 \}\}/;
const replace = `initial={{ opacity: 0, y: -200, scale: 0.2 }}`;
code = code.replace(regex, replace);

// And when cards are played from OTHER players, they go to discard pile.
// The discard pile's initial is currently `scale: 1.2, opacity: 0`. We can make it come from the top!
const discardRegex = /initial=\{\{ scale: 1.2, opacity: 0, rotate: Math\.random\(\) \* 20 - 10 \}\}/;
const discardReplace = `initial={{ scale: 1.5, opacity: 0, y: -100, rotate: Math.random() * 20 - 10 }}`;
code = code.replace(discardRegex, discardReplace);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Deck anim applied");
