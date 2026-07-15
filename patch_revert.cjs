const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

code = code.replace(/scale-\[0\.6\] sm:scale-\[0\.8\] md:scale-100 origin-bottom -mx-6 sm:-mx-4 md:mx-0 /g, '');

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Reverted card scale classes");
