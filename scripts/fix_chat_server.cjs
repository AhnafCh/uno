const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /    socket\.on\("chat_message", \(\{roomId, message\}: \{roomId: string, message: string\}\) => \{\n        const room = rooms\.get\(roomId\);\n        if \(\!room\) return;\n        const player = room\.players\.find\(p => p\.id === socket\.id\);\n        if \(\!player\) return;\n        room\.chat\.push\(\{\n            id: Math\.random\(\)\.toString\(36\)\.substring\(7\),\n            senderName: player\.name,\n            message,\n            timestamp: Date\.now\(\)\n        \}\);\n        if \(room\.chat\.length > 50\) \{\n            room\.chat\.shift\(\);\n        \}\n        io\.to\(roomId\)\.emit\("state_update", room\);\n    \}\);\n/;

code = code.replace(regex, "");

fs.writeFileSync('src/server/game.ts', code);
