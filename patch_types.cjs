const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf-8');

code = code.replace(/jumpInExpiry\?: number;/g, 'jumpInExpiry?: number;\n  serverNow?: number;');

fs.writeFileSync('src/types.ts', code);
console.log("Fixed types.ts to include serverNow");
