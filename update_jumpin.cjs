const fs = require('fs');
let types = fs.readFileSync('src/types.ts', 'utf8');
if (!types.includes('lastPlayTime?: number;')) {
    types = types.replace('turnStartTime?: number;', 'turnStartTime?: number;\n  lastPlayTime?: number;');
    fs.writeFileSync('src/types.ts', types);
}
