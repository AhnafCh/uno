const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

let count = 0;
code = code.replace(/socket\.on\("chat_message", \(\{roomId, message\}[\s\S]*?io\.to\(roomId\)\.emit\("state_update", room\);\n    \}\);/g, (match) => {
    count++;
    if (count === 2) {
        return ""; // remove the second one
    }
    return match;
});

fs.writeFileSync('src/server/game.ts', code);
