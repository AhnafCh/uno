const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

// The file ends with:
//   });
// }
// If balance is -1, maybe it has one extra '}'. Let's remove the very last '}'.

code = code.trim();
if (code.endsWith('}')) {
   code = code.substring(0, code.length - 1);
}

fs.writeFileSync('src/server/game.ts', code);
