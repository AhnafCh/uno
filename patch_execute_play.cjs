const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

code = code.replace(/function executePlayCard\(roomId: string, io: Server, playerIndex: number, cardId: string, chosenColor\?: CardColor, socket\?: Socket\) \{/, "function executePlayCard(roomId: string, io: Server, playerIndex: number, cardId: string, chosenColor?: CardColor, socket?: Socket, topCardId?: string) {");
code = code.replace(/function executePlay7\(roomId: string, io: Server, playerIndex: number, targetPlayerId: string, cardId: string, chosenColor\?: CardColor, socket\?: Socket\) \{/, "function executePlay7(roomId: string, io: Server, playerIndex: number, targetPlayerId: string, cardId: string, chosenColor?: CardColor, socket?: Socket, topCardId?: string) {");

code = code.replace(/socket\.on\("play_card", \(\{ roomId, cardId, chosenColor \}: \{ roomId: string; cardId: string; chosenColor\?: CardColor \}\) => \{/, "socket.on(\"play_card\", ({ roomId, cardId, chosenColor, topCardId }: { roomId: string; cardId: string; chosenColor?: CardColor; topCardId?: string }) => {");
code = code.replace(/executePlayCard\(roomId, io, playerIndex, cardId, chosenColor, socket\);/, "executePlayCard(roomId, io, playerIndex, cardId, chosenColor, socket, topCardId);");

code = code.replace(/socket\.on\("swap_hand", \(\{ roomId, targetPlayerId, cardId, chosenColor \}: \{ roomId: string, targetPlayerId: string, cardId: string, chosenColor\?: CardColor \}\) => \{/, "socket.on(\"swap_hand\", ({ roomId, targetPlayerId, cardId, chosenColor, topCardId }: { roomId: string, targetPlayerId: string, cardId: string, chosenColor?: CardColor, topCardId?: string }) => {");
code = code.replace(/executePlay7\(roomId, io, playerIndex, targetPlayerId, cardId, chosenColor, socket\);/, "executePlay7(roomId, io, playerIndex, targetPlayerId, cardId, chosenColor, socket, topCardId);");

const targetJumpInCheck = /const isExactMatch = card\.color === topCard\.color && card\.value === topCard\.value && card\.color \!== 'wild';/g;
const replacementJumpInCheck = `const isExactMatch = card.color === topCard.color && card.value === topCard.value && card.color !== 'wild' && (topCardId ? topCard.id === topCardId : true);`;

code = code.replace(targetJumpInCheck, replacementJumpInCheck);

fs.writeFileSync('src/server/game.ts', code);
console.log("Patched executePlayCard and executePlay7");
