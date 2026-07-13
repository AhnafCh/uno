const fs = require('fs');
let game = fs.readFileSync('src/server/game.ts', 'utf8');

// When a card is played
game = game.replace('room.drawnCardThisTurn = null; // Clear draw state', 'room.drawnCardThisTurn = null; // Clear draw state\n  room.lastPlayTime = Date.now();');

// Also update it for rule 7 play
game = game.replace('room.currentColor = (card.color === \'wild\' && chosenColor) ? chosenColor : card.color;', 'room.currentColor = (card.color === \'wild\' && chosenColor) ? chosenColor : card.color;\n   room.lastPlayTime = Date.now();');

// And when drawCards happen by next player using turn
// Actually, drawCard is an explicit action. Let's find socket.on("draw_card") and clear lastPlayTime
game = game.replace('socket.on("draw_card", (roomId: string) => {', 'socket.on("draw_card", (roomId: string) => {\n    const r = rooms.get(roomId);\n    if (r) r.lastPlayTime = 0;');

fs.writeFileSync('src/server/game.ts', game);
