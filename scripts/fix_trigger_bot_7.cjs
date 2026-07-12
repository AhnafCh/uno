const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /room\.turnStartTime = Date\.now\(\);\n\s*\}\n\s*io\.to\(roomId\)\.emit\("state_update", room\);/;

const replace = `room.turnStartTime = Date.now();
  }
  io.to(roomId).emit("state_update", room);
  triggerBotIfTurn(roomId, io);`;

if (regex.test(code)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Fixed trigger bot for 7");
} else {
    console.log("No match");
}
