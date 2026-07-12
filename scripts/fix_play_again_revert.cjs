const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /room\.players = room\.players\.map\(p => \(\{\n\s*\.\.\.p,\n\s*hand: \[\],\n\s*unoCalled: false,\n\s*eliminated: false,\n\s*\}\)\);\n\s*room\.deck = generateDeck\(\);\n\s*room\.players\.forEach\(p => p\.hand = drawCards\(room, 7\)\);\n\s*let topCard = room\.deck\.pop\(\)\!;\n\s*while \(topCard\.color === 'wild'\) \{\n\s*room\.deck\.unshift\(topCard\);\n\s*topCard = room\.deck\.pop\(\)\!;\n\s*\}\n\s*room\.discardPile = \[topCard\];\n\s*room\.currentColor = topCard\.color;\n\s*io\.to\(roomId\)\.emit\("state_update", room\);\n\s*triggerBotIfTurn\(roomId, io\);/;

const replace = `room.players = room.players.map(p => ({
            ...p,
            hand: [],
            unoCalled: false,
            eliminated: false,
        }));
        
        io.to(roomId).emit("state_update", room);`;

if (regex.test(code)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Fixed play_again revert");
} else {
    console.log("No match");
}
