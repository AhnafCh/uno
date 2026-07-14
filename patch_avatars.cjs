const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const oldAvatars = `const AVATARS = [
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

const newAvatars = `const AVATARS = [
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐶</text></svg>",
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦊</text></svg>",
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐯</text></svg>",
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐼</text></svg>",
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐸</text></svg>",
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐵</text></svg>",
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐷</text></svg>",
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐻</text></svg>",
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐨</text></svg>",
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐰</text></svg>"
];`;

if (code.includes(oldAvatars)) {
    code = code.replace(oldAvatars, newAvatars);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Patched avatars to 10 different animals");
} else {
    console.log("Could not find the target avatar array.");
}
