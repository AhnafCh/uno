const fs = require('fs');

let code = fs.readFileSync('src/server/game.ts', 'utf8');

const botMatch = code.match(/function executeBotMove\([\s\S]*?function triggerBotIfTurn/m);

const newBotFunction = `function executeBotMove(roomId: string, io: Server) {
  const room = rooms.get(roomId);
  if (!room || room.status !== 'playing') return;

  const playerIndex = room.currentPlayerIndex;
  const player = room.players[playerIndex];
  if (!player || !player.isBot) return;
  
  // 1. Check if bot needs to call UNO
  if (player.hand.length <= 2 && !player.unoCalled) {
      player.unoCalled = true;
      room.lastActionMessage = \`\${player.name} yelled UNO!\`;
  }
  
  // 2. Catch anyone else
  for (const p of room.players) {
      if (p.id !== player.id && p.hand.length === 1 && !p.unoCalled) {
          const drawn = drawCards(room, 2);
          p.hand.push(...drawn);
          room.lastActionMessage = \`\${player.name} caught \${p.name} not saying UNO! +2 cards\`;
          io.to(roomId).emit("state_update", room);
      }
  }

  const topCard = room.discardPile[room.discardPile.length - 1];
  const isStacking = room.currentPenalty > 0;

  let playableCards: Card[] = [];

  for (const card of player.hand) {
     let valid = false;
     
     if (room.drawnCardThisTurn) {
         if (card.id === room.drawnCardThisTurn.id) {
             if (isStacking && room.stackingEnabled) {
                if (topCard.value === 'draw4' && card.value === 'draw4') valid = true;
                if (topCard.value === 'draw2' && (card.value === 'draw2' || card.value === 'draw4')) valid = true;
             } else if (!isStacking) {
                if (card.color === room.currentColor || card.color === 'wild' || card.value === topCard.value) valid = true;
             }
         }
     } else {
         if (isStacking) {
            if (room.stackingEnabled) {
               if (topCard.value === 'draw4' && card.value === 'draw4') valid = true;
               if (topCard.value === 'draw2' && (card.value === 'draw2' || card.value === 'draw4')) valid = true;
            }
         } else {
            if (card.color === room.currentColor || card.color === 'wild' || card.value === topCard.value) {
               valid = true;
            }
         }
     }
     if (valid) playableCards.push(card);
  }

  let playableCard: Card | undefined = undefined;
  let chosenColor: CardColor | undefined = undefined;
  let targetPlayerId: string | undefined = undefined;

  if (playableCards.length > 0) {
      if (player.botPersonality === 'aggressive') {
          playableCards.sort((a, b) => {
              const aAction = ['draw4', 'draw2', 'skip', 'reverse'].includes(a.value) ? 1 : 0;
              const bAction = ['draw4', 'draw2', 'skip', 'reverse'].includes(b.value) ? 1 : 0;
              return bAction - aAction;
          });
      } else if (player.botPersonality === 'hoarder') {
          playableCards.sort((a, b) => {
              const aWild = a.color === 'wild' ? 1 : 0;
              const bWild = b.color === 'wild' ? 1 : 0;
              return aWild - bWild;
          });
      }

      playableCard = playableCards[0];
      
      if (playableCard.color === 'wild') {
          const colors = player.hand.filter(c => c.color !== 'wild').map(c => c.color);
          chosenColor = colors.length > 0 ? colors.sort((a,b) =>
              colors.filter(v => v===a).length - colors.filter(v => v===b).length
          ).pop() : 'red';
      }
      
      if (playableCard.value === '7' && (room.mode === 'no-mercy' || room.rule70Enabled)) {
          let minCards = Infinity;
          for (const p of room.players) {
            if (p.id !== player.id && p.hand.length < minCards && !p.eliminated) {
                minCards = p.hand.length;
                targetPlayerId = p.id;
            }
          }
          if (!targetPlayerId) {
              targetPlayerId = room.players.find(p => p.id !== player.id && !p.eliminated)?.id;
          }
      }
  }

  if (room.drawnCardThisTurn) {
      if (playableCard) {
          if (playableCard.value === '7' && (room.mode === 'no-mercy' || room.rule70Enabled) && targetPlayerId) {
              executePlay7(roomId, io, playerIndex, targetPlayerId, playableCard.id, chosenColor);
          } else {
              executePlayCard(roomId, io, playerIndex, playableCard.id, chosenColor);
          }
      } else {
          // Pass turn
          room.drawnCardThisTurn = null;
          room.currentPlayerIndex = nextPlayerIndex(room, 1);
          room.lastActionMessage = \`\${player.name} passed.\`;
          io.to(roomId).emit("state_update", room);
          triggerBotIfTurn(roomId, io);
      }
  } else {
      if (playableCard) {
        if (playableCard.value === '7' && (room.mode === 'no-mercy' || room.rule70Enabled) && targetPlayerId) {
            executePlay7(roomId, io, playerIndex, targetPlayerId, playableCard.id, chosenColor);
        } else {
            executePlayCard(roomId, io, playerIndex, playableCard.id, chosenColor);
        }
      } else {
        executeDrawCard(roomId, io, playerIndex);
      }
  }
}

function triggerBotIfTurn`;

code = code.replace(/function executeBotMove\([\s\S]*?function triggerBotIfTurn/m, newBotFunction);
fs.writeFileSync('src/server/game.ts', code);
