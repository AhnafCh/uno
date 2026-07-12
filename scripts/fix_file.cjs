const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

// The file starts with socket.on("pass_turn"...
// It should start with imports. Let's move the pass_turn block to the correct place.

const misplacedPassTurnRegex = /socket\.on\("pass_turn", \(roomId: string\) => \{[\s\S]*?triggerBotIfTurn\(roomId, io\);\n\s*\}\n\s*\}\);\n/;

const match = code.match(misplacedPassTurnRegex);
if (match) {
    code = code.replace(misplacedPassTurnRegex, '');
    
    // Find where to put it
    // Let's put it inside io.on("connection"
    const target = /socket\.on\("play_again",/;
    code = code.replace(target, match[0] + "\n    socket.on(\"play_again\",");
    
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Fixed misplaced pass_turn");
} else {
    console.log("Not found");
}

