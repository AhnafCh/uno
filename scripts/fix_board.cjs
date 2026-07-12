const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// Fix toast duplicate bug
const regexToast = /key=\{gameState\.lastActionMessage \+ Math\.random\(\)\}/g;
code = code.replace(regexToast, 'key={gameState.lastActionMessage}');

// Fix vertical scroll
const regexScroll = /className="flex \-space-x-8 hover:space-x-2 transition-all duration-300 px-4 max-w-6xl mx-auto items-center overflow-x-auto h-full pt-16 pb-8 custom-scrollbar"/g;
code = code.replace(regexScroll, 'className="flex -space-x-8 hover:space-x-2 transition-all duration-300 px-4 max-w-6xl mx-auto items-center overflow-x-auto overflow-y-hidden h-full pt-16 pb-8 custom-scrollbar"');

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Fixed issues in GameBoard.tsx");
