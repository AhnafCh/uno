const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

code = code.replace(/room\.jumpInExpiry = Date\.now\(\) \+ 5000;\n\s+const displayColor/g, 'const displayColor');

fs.writeFileSync('src/server/game.ts', code);
console.log("Fixed jumpInExpiry cleanup");
