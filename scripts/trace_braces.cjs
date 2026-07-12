const fs = require('fs');
const lines = fs.readFileSync('src/server/game.ts', 'utf8').split('\n');
let open = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const oldOpen = open;
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '{') open++;
    if (line[j] === '}') open--;
  }
  if (open === 0 && oldOpen > 0) {
     console.log('Balance hit 0 at line:', i + 1);
  } else if (open < 0) {
     console.log('Balance negative at line:', i + 1);
     open = 0; // reset to see further errors
  }
}
