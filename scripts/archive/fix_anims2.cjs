const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// The original motion element replacement from fix_delay.cjs was:
// gameBoard = gameBoard.replace(/Math\.min\(index \* 0\.05, 0\.5\)/g, 'Math.min(index * 0.1, 1.5)');
// Which means the code was: 
// animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, x: 0, transition: { delay: Math.min(index * 0.1, 1.5) } }}

// Let's replace the whole animate block:
const regex = /initial=\{\{\s*opacity:\s*0,\s*y:\s*100,\s*scale:\s*0\.5\s*\}\}\n\s*animate=\{\{\s*opacity:\s*1,\s*y:\s*0,\s*scale:\s*1,\s*rotate:\s*0,\s*x:\s*0,\s*transition:\s*\{\s*delay:\s*Math\.min\(index\s*\*\s*0\.1,\s*1\.5\)\s*\}\s*\}\}/;

if (regex.test(gameBoard)) {
    gameBoard = gameBoard.replace(regex, `initial={{ opacity: 0, y: -300, scale: 0.2, x: 0 }}
                       animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, x: 0, transition: { type: "spring", stiffness: 200, damping: 20, delay: index > 0 ? (index % 10) * 0.1 : 0 } }}`);
    console.log("Found and replaced");
} else {
    console.log("Could not find the regex match");
}

fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
