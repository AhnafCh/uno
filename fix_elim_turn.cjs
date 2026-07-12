const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /checkEliminations\(room, io\);\n\s*\} else \{\n\s*room\.lastActionMessage = \`No cards left\! \$\{player\.name\} passed automatically\.\`;\n\s*room\.currentPlayerIndex = nextPlayerIndex\(room, 1\);\n\s*room\.turnStartTime = Date\.now\(\);\n\s*\}\n\s*\}\n\s*\}/;

const replace = `checkEliminations(room, io);
      } else {
          room.lastActionMessage = \`No cards left! \${player.name} passed automatically.\`;
          room.currentPlayerIndex = nextPlayerIndex(room, 1);
          room.turnStartTime = Date.now();
      }
    }
  }
  
  if (room.players[room.currentPlayerIndex].eliminated) {
      room.drawnCardThisTurn = null;
      room.currentPlayerIndex = nextPlayerIndex(room, 1);
      room.turnStartTime = Date.now();
  }`;

if (regex.test(code)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Fixed elim turn");
} else {
    console.log("No match");
}
