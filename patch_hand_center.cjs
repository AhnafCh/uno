const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

code = code.replace(
  'className="flex -space-x-8 hover:space-x-2 transition-all duration-300 px-8 w-full items-center overflow-x-auto h-full pt-4 pb-0 hide-scrollbar"\n                 >',
  'className="flex -space-x-8 hover:space-x-2 transition-all duration-300 px-8 w-full items-center overflow-x-auto h-full pt-4 pb-0 hide-scrollbar"\n                 style={{ justifyContent: \'safe center\' }}>'
);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Fixed hand centering");
