const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

code = code.replace(
  'className="flex-1 py-4 bg-white/10 hover:bg-white/20 font-bold rounded-lg transition border border-white/10"',
  'className="flex-1 flex items-center justify-center py-4 bg-white/10 hover:bg-white/20 font-bold rounded-lg transition border border-white/10"'
);

code = code.replace(
  '<Shuffle size={18} className="inline mr-2" /> Shuffle Seats',
  '<Shuffle size={18} className="mr-2" /> Shuffle Seats'
);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Fixed flex on button");
