const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const rotate0Regex = /\} else if \(\(room\.mode === 'no-mercy' \|\| room\.rule70Enabled\) && card\.value === '0'\) \{\n\s*const hands = room\.players\.map\(p => p\.hand\);\n\s*for\(let i = 0; i < room\.players\.length; i\+\+\) \{\n\s*const destIndex = \(i \+ room\.direction \+ room\.players\.length\) % room\.players\.length;\n\s*room\.players\[destIndex\]\.hand = hands\[i\];\n\s*\}\n\s*room\.lastActionMessage = \`\$\{player\.name\} played 0 - Hands rotated\!\`;\n\s*\}/;

const fixedRotate0 = `} else if ((room.mode === 'no-mercy' || room.rule70Enabled) && card.value === '0') {
     const hands = room.players.map(p => p.hand);
     for(let i = 0; i < room.players.length; i++) {
        const destIndex = (i + room.direction + room.players.length) % room.players.length;
        room.players[destIndex].hand = hands[i];
        if (hands[i].length > 1) {
            room.players[destIndex].unoCalled = false;
        } else {
            // Even if they get 1 card, they haven't called it for this new hand
            room.players[destIndex].unoCalled = false;
        }
     }
     room.lastActionMessage = \`\${player.name} played 0 - Hands rotated!\`;
  }`;

code = code.replace(rotate0Regex, fixedRotate0);
fs.writeFileSync('src/server/game.ts', code);
