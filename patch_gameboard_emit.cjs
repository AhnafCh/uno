const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

code = code.replace(/socket\.emit\('play_card', \{ roomId: gameState\.id, cardId: card\.id \}\);/g, "socket.emit('play_card', { roomId: gameState.id, cardId: card.id, topCardId: gameState.discardPile[gameState.discardPile.length - 1]?.id });");
code = code.replace(/socket\.emit\('play_card', \{ roomId: gameState\.id, cardId, chosenColor: color \}\);/g, "socket.emit('play_card', { roomId: gameState.id, cardId, chosenColor: color, topCardId: gameState.discardPile[gameState.discardPile.length - 1]?.id });");
code = code.replace(/socket\.emit\('swap_hand', \{\s*roomId: gameState\.id,\s*targetPlayerId,\s*cardId: showPlayerPicker\.cardId,\s*chosenColor: showColorPicker\?\.cardId === showPlayerPicker\.cardId \? selectedColor : undefined\s*\}\);/g, "socket.emit('swap_hand', { roomId: gameState.id, targetPlayerId, cardId: showPlayerPicker.cardId, chosenColor: showColorPicker?.cardId === showPlayerPicker.cardId ? selectedColor : undefined, topCardId: gameState.discardPile[gameState.discardPile.length - 1]?.id });");

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Patched GameBoard emits");
