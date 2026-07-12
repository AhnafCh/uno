const fs = require('fs');
const lines = fs.readFileSync('src/server/game.ts', 'utf8').split('\n');
let open = 0;
let insideSetup = false;
let insideIo = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('export function setupGameLogic')) insideSetup = true;
  if (line.includes('io.on("connection"')) insideIo = true;

  const oldOpen = open;
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '{') open++;
    if (line[j] === '}') open--;
  }

  if (insideIo && open === 1) {
     console.log('io.on closed at line:', i + 1);
     insideIo = false;
  }
}
