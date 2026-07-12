const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const oldPlay7Regex = /if \(p1\.hand\.length === 0\) \{\n\s*room\.status = 'finished';\n\s*room\.winner = p1\.name;\n\s*io\.to\(roomId\)\.emit\("state_update", room\);\n\s*return;\n\s*\}/;
code = code.replace(oldPlay7Regex, "");

const endPlay7Regex = /room\.turnStartTime = Date\.now\(\);\n\s*io\.to\(roomId\)\.emit\("state_update", room\);\n\s*triggerBotIfTurn\(roomId, io\);\n\}/;
code = code.replace(endPlay7Regex, 
`room.turnStartTime = Date.now();
  if (checkWinner(room, io)) return;
  io.to(roomId).emit("state_update", room);
  triggerBotIfTurn(roomId, io);
}`);

fs.writeFileSync('src/server/game.ts', code);
