const fs = require('fs');

let code = fs.readFileSync('src/server/game.ts', 'utf8');

const botLogicUpdate = `  let playableCards: Card[] = [];

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
            if (room.stackingEnabled) { // removed mode === 'no-mercy' check for stacking
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
          // Play +4, +2, Skip, Reverse first
          playableCards.sort((a, b) => {
              const aAction = ['draw4', 'draw2', 'skip', 'reverse'].includes(a.value) ? 1 : 0;
              const bAction = ['draw4', 'draw2', 'skip', 'reverse'].includes(b.value) ? 1 : 0;
              return bAction - aAction;
          });
      } else if (player.botPersonality === 'hoarder') {
          // Keep wilds for last
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
  }`;

code = code.replace(/  for \(const card of player\.hand\) \{[\s\S]*?break;\s*\}\s*\}/, botLogicUpdate);
fs.writeFileSync('src/server/game.ts', code);
