const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const targetAvatars = /const AVATARS = \[[\s\S]*?\];/;

const replacementAvatars = `const AVATARS = [
  "https://robohash.org/Felix.svg?set=set4",
  "https://robohash.org/Bella.svg?set=set4",
  "https://robohash.org/Charlie.svg?set=set4",
  "https://robohash.org/Lucy.svg?set=set4",
  "https://robohash.org/Max.svg?set=set4",
  "https://robohash.org/Daisy.svg?set=set4",
  "https://robohash.org/Rocky.svg?set=set4",
  "https://robohash.org/Milo.svg?set=set4",
  "https://robohash.org/Leo.svg?set=set4",
  "https://robohash.org/Simba.svg?set=set4"
];`;

if (code.match(targetAvatars)) {
    code = code.replace(targetAvatars, replacementAvatars);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Patched AVATARS");
} else {
    console.log("Could not find AVATARS array");
}
