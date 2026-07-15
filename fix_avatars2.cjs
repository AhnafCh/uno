const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const emojis = ['👽', '👻', '🤖', '👾', '🤠', '🤡', '👹', '👺', '😺', '💩'];
const avatarsStr = "const AVATARS = [\n" + emojis.map(e => \`  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-size=%2280%22>\${e}</text></svg>"\`).join(",\n") + "\n];";

code = code.replace(/const AVATARS = \[[^\]]+\];/, avatarsStr);

fs.writeFileSync('src/server/game.ts', code);
console.log("Fixed avatars 2");
