const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /\} else if \(\(room\.mode === 'no-mercy' \|\| room\.rule70Enabled\) && card\.value === '0'\) \{\n\s*const hands = room\.players\.map\(p => p\.hand\);\n\s*for\(let i = 0; i < room\.players\.length; i\+\+\) \{\n\s*const destIndex = \(i \+ room\.direction \+ room\.players\.length\) % room\.players\.length;\n\s*room\.players\[destIndex\]\.hand = hands\[i\];\n\s*if \(hands\[i\]\.length > 1\) \{\n\s*room\.players\[destIndex\]\.unoCalled = false;\n\s*\} else \{\n\s*\/\/ Even if they get 1 card, they haven't called it for this new hand\n\s*room\.players\[destIndex\]\.unoCalled = false;\n\s*\}\n\s*\}\n\s*room\.lastActionMessage = \`\$\{player\.name\} played 0 - Hands rotated\!\`;\n\s*\}/;

const replace = `} else if ((room.mode === 'no-mercy' || room.rule70Enabled) && card.value === '0') {
     const activePlayers = room.players.filter(p => !p.eliminated);
     const hands = activePlayers.map(p => p.hand);
     for(let i = 0; i < activePlayers.length; i++) {
        const destIndex = (i + room.direction + activePlayers.length) % activePlayers.length;
        activePlayers[destIndex].hand = hands[i];
        activePlayers[destIndex].unoCalled = false;
     }
     room.lastActionMessage = \`\${player.name} played 0 - Hands rotated!\`;
  }`;

if (regex.test(code)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/server/game.ts', code);
    console.log('Fixed 0 for eliminated players');
} else {
    console.log('Regex did not match!');
}
