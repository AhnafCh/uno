const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const targetStartGame = /room\.deck = generateDeck\(room\.mode\);\s*room\.players\.forEach\(p => p\.hand = drawCards\(room, 7\)\);\s*let topCard = room\.deck\.pop\(\)!\;\s*while \(topCard\.color === 'wild'\) \{\s*room\.deck\.unshift\(topCard\);\s*topCard = room\.deck\.pop\(\)!;\s*\}\s*room\.discardPile = \[topCard\];\s*room\.currentColor = topCard\.color;\s*room\.status = 'playing';\s*room\.turnStartTime = Date\.now\(\);\s*room\.currentPlayerIndex = 0;\s*room\.turnStartTime = Date\.now\(\); \/\/ Host starts/;

const replacementStartGame = `// Shuffle players array
      for (let i = room.players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [room.players[i], room.players[j]] = [room.players[j], room.players[i]];
      }

      room.deck = generateDeck(room.mode);
      room.players.forEach(p => p.hand = drawCards(room, 7));
      
      let topCard = room.deck.pop()!;
      while (topCard.color === 'wild' || topCard.value === 'draw2' || topCard.value === 'draw4' || topCard.value === 'reverse' || topCard.value === 'skip' || topCard.value === 'skip_everyone' || topCard.value === 'wild_reverse_draw4' || topCard.value === 'wild_draw6' || topCard.value === 'wild_draw10' || topCard.value === 'wild_color_roulette') {
        room.deck.unshift(topCard);
        topCard = room.deck.pop()!;
      }
      room.discardPile = [topCard];
      room.currentColor = topCard.color;
      
      room.status = 'playing';
      room.currentPlayerIndex = Math.floor(Math.random() * room.players.length);
      room.turnStartTime = Date.now();`;

if (code.match(targetStartGame)) {
    console.log("Found start_game block");
    code = code.replace(targetStartGame, replacementStartGame);
    fs.writeFileSync('src/server/game.ts', code);
} else {
    console.log("Could not find start_game block");
}
