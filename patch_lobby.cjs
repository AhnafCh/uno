const fs = require('fs');
let code = fs.readFileSync('src/components/Lobby.tsx', 'utf-8');

code = code.replaceAll(", type: 'action'", "");
code = code.replaceAll(", type: 'wild'", "");
code = code.replaceAll("value: 'wild_draw4'", "value: 'draw4'");

fs.writeFileSync('src/components/Lobby.tsx', code);
console.log("Patched Lobby.tsx");
