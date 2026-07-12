const fs = require('fs');
let code = fs.readFileSync('src/components/Lobby.tsx', 'utf8');

const modeSelectorRegex = /<div>\s*<label className="block text-sm font-medium text-neutral-400 mb-1">Game Mode \(if creating\)<\/label>[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(modeSelectorRegex, '');

fs.writeFileSync('src/components/Lobby.tsx', code);
