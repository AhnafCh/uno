const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const regex = /room\.currentColor = 'red';\n\s*\/\/ Keep players but reset their state\n\s*room\.players = room\.players\.map\(p => \(\{\n\s*\.\.\.p,\n\s*hand: \[\],\n\s*unoCalled: false,\n\s*eliminated: false,\n\s*\}\)\);\n\s*io\.to\(roomId\)\.emit\("state_update", room\);/;

const replace = `// Keep players but reset their state
        room.players = room.players.map(p => ({
            ...p,
            hand: [],
            unoCalled: false,
            eliminated: false,
        }));
        
        room.deck = generateDeck();
        room.players.forEach(p => p.hand = drawCards(room, 7));
        
        let topCard = room.deck.pop()!;
        while (topCard.color === 'wild') {
          room.deck.unshift(topCard);
          topCard = room.deck.pop()!;
        }
        room.discardPile = [topCard];
        room.currentColor = topCard.color;

        io.to(roomId).emit("state_update", room);
        triggerBotIfTurn(roomId, io);`;

if (regex.test(code)) {
    code = code.replace(regex, replace);
    fs.writeFileSync('src/server/game.ts', code);
    console.log("Fixed play_again");
} else {
    console.log("No match");
}
