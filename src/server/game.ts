import { Server, Socket } from "socket.io";
import { Card, CardColor, CardValue, GameState, Player, ChatMessage, GameMode } from "../types.ts";

const rooms = new Map<string, GameState>();

const COLORS: CardColor[] = ['red', 'blue', 'green', 'yellow'];
const VALUES: CardValue[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'draw2'];

function generateDeck(): Card[] {
  const deck: Card[] = [];
  let id = 0;
  
  for (const color of COLORS) {
    deck.push({ id: `c${id++}`, color, value: '0' });
    for (const value of VALUES.slice(1)) {
      deck.push({ id: `c${id++}`, color, value });
      deck.push({ id: `c${id++}`, color, value });
    }
  }
  
  for (let i = 0; i < 4; i++) {
    deck.push({ id: `c${id++}`, color: 'wild', value: 'wild' });
    deck.push({ id: `c${id++}`, color: 'wild', value: 'draw4' });
  }
  
  return deck.sort(() => Math.random() - 0.5);
}

function createRoom(roomId: string, mode: GameMode = 'normal'): GameState {
  const room: GameState = {
    id: roomId,
    mode,
    status: 'lobby',
    players: [],
    currentPlayerIndex: 0,
    direction: 1,
    deck: [],
    discardPile: [],
    currentColor: 'red', // Dummy initial
    currentPenalty: 0,
    winner: null,
    chat: [],
    lastActionMessage: 'Room created',
    eliminationLimit: 20,
    jumpInEnabled: true,
    stackingEnabled: mode === 'no-mercy',
    drawnCardThisTurn: null
  };
  rooms.set(roomId, room);
  return room;
}


function checkEliminations(room: GameState, io: Server) {
    if (!room.eliminationLimit || room.eliminationLimit <= 0) return;
    let anyEliminated = false;
    for (const p of room.players) {
        if (!p.eliminated && p.hand.length >= room.eliminationLimit) {
            p.eliminated = true;
            // Put cards at the bottom of the deck
            room.deck = [...p.hand, ...room.deck];
            p.hand = [];
            anyEliminated = true;
            room.lastActionMessage = `${p.name} was eliminated (Reached ${room.eliminationLimit} cards)!`;
        }
    }
    const activePlayers = room.players.filter(p => !p.eliminated && (p.connected || p.isBot));
    if (activePlayers.length <= 1 && activePlayers.length > 0) {
        room.status = 'finished';
        room.winner = activePlayers[0].name;
    } else if (activePlayers.length === 0) {
        room.status = 'finished';
        room.winner = "No one";
    }
}


function checkWinner(room: GameState, io: Server): boolean {
    const winner = room.players.find(p => p.hand.length === 0 && !p.eliminated);
    if (winner) {
        room.status = 'finished';
        room.winner = winner.name;
        io.to(room.id).emit("state_update", room);
        return true;
    }
    return false;
}

function nextPlayerIndex(room: GameState, skipCount = 1) {
  let next = room.currentPlayerIndex;
  for (let i = 0; i < skipCount; i++) {
    next = (next + room.direction + room.players.length) % room.players.length;
    // skip disconnected (but bots are always connected)
    let loopCount = 0;
    while (((!room.players[next].connected && !room.players[next].isBot) || room.players[next].eliminated) && loopCount < room.players.length) {
      next = (next + room.direction + room.players.length) % room.players.length;
      loopCount++;
    }
  }
  return next;
}


function executePlayCard(roomId: string, io: Server, playerIndex: number, cardId: string, chosenColor?: CardColor, socket?: Socket) {
  const room = rooms.get(roomId);
  if (!room || room.status !== 'playing') return;
  const player = room.players[playerIndex];
  if (player.eliminated) return;

  const isTurn = playerIndex === room.currentPlayerIndex;
  const cardIndex = player.hand.findIndex(c => c.id === cardId);
  if (cardIndex === -1) return;

  const card = player.hand[cardIndex];
  const topCard = room.discardPile[room.discardPile.length - 1];

  const isExactMatch = card.color === topCard.color && card.value === topCard.value && card.color !== 'wild';
  const canJumpIn = room.jumpInEnabled && !isTurn && isExactMatch && room.currentPenalty === 0 && !room.drawnCardThisTurn && room.jumpInExpiry && Date.now() <= room.jumpInExpiry;

  if (!isTurn && !canJumpIn) {
      socket?.emit("error", "Not your turn");
      return;
  }

  if (isTurn && room.drawnCardThisTurn && room.drawnCardThisTurn.id !== cardId) {
      socket?.emit("error", "You can only play the drawn card or pass");
      return;
  }

  if (canJumpIn) {
      room.currentPlayerIndex = playerIndex;
  room.turnStartTime = Date.now();
      room.lastActionMessage = `${player.name} jumped in!`;
  }

  const isValidColor = card.color === room.currentColor || card.color === 'wild';
  const isValidValue = card.value === topCard.value;
  const isStacking = room.currentPenalty > 0;
  
  let valid = false;
  if (isStacking) {
    if (room.stackingEnabled) {
       if (topCard.value === 'draw4' && card.value === 'draw4') valid = true;
       if (topCard.value === 'draw2' && (card.value === 'draw2' || card.value === 'draw4')) valid = true;
    }
  } else {
    if (isValidColor || isValidValue) valid = true;
  }

  if (card.color === 'wild' && !chosenColor) {
     socket?.emit("error", "Color must be chosen for wild cards");
     return;
  }

  if (!valid) {
    socket?.emit("error", "Invalid move");
    return;
  }

  // Apply play
  player.hand.splice(cardIndex, 1);
  if (player.hand.length > 1) player.unoCalled = false;
  room.discardPile.push(card);
  room.currentColor = (card.color === 'wild' && chosenColor) ? chosenColor : card.color;
   room.jumpInExpiry = Date.now() + 5000;
  room.lastActionMessage = `${player.name} played ${card.color !== 'wild' ? card.color : chosenColor} ${card.value}`;
  room.drawnCardThisTurn = null; // Clear draw state
  room.jumpInExpiry = Date.now() + 5000;

  if (player.hand.length === 0) {
      room.status = 'finished';
      room.winner = player.name;
      io.to(roomId).emit("state_update", room);
      return;
  }

  // Apply card effects
  let skip = 1;
  if (card.value === 'skip') {
    skip = 2;
  } else if (card.value === 'reverse') {
    room.direction *= -1;
    if (room.players.filter(p => p.connected || p.isBot).length === 2) {
      skip = 2; // In 2 player, reverse acts like skip
    }
  } else if (card.value === 'draw2') {
    if (room.mode === 'no-mercy') room.currentPenalty += 2;
    else room.currentPenalty = 2;
  } else if (card.value === 'draw4') {
    if (room.mode === 'no-mercy') room.currentPenalty += 4;
    else room.currentPenalty = 4;
  } else if ((room.mode === 'no-mercy' || room.rule70Enabled) && card.value === '0') {
     const activePlayers = room.players.filter(p => !p.eliminated);
     const hands = activePlayers.map(p => p.hand);
     for(let i = 0; i < activePlayers.length; i++) {
        const destIndex = (i + room.direction + activePlayers.length) % activePlayers.length;
        activePlayers[destIndex].hand = hands[i];
        activePlayers[destIndex].unoCalled = false;
     }
     room.lastActionMessage = `${player.name} played 0 - Hands rotated!`;
  }

  if (!isStacking && !room.stackingEnabled && room.currentPenalty > 0 && room.mode === 'normal') {
      const nextIndex = nextPlayerIndex(room, 1);
      const drawn = drawCards(room, room.currentPenalty);
      room.players[nextIndex].hand.push(...drawn);
      room.players[nextIndex].unoCalled = false;
      room.lastActionMessage += ` (and ${room.players[nextIndex].name} drew ${room.currentPenalty})`;
      room.currentPenalty = 0;
      checkEliminations(room, io);
      room.currentPlayerIndex = nextIndex;
      skip = 1;
  }

  room.currentPlayerIndex = nextPlayerIndex(room, skip);
  room.turnStartTime = Date.now();
  if (checkWinner(room, io)) return;
  io.to(roomId).emit("state_update", room);
  triggerBotIfTurn(roomId, io);
}


function executeDrawCard(roomId: string, io: Server, playerIndex: number) {
  const room = rooms.get(roomId);
  if (!room || room.status !== 'playing') return;
  if (playerIndex !== room.currentPlayerIndex) return;
  if (room.drawnCardThisTurn) return; // Already drawn
  
  const player = room.players[playerIndex];
  if (player.eliminated) return;

  if (room.currentPenalty > 0) {
    const drawn = drawCards(room, room.currentPenalty);
    player.hand.push(...drawn);
    player.unoCalled = false;
    room.lastActionMessage = `${player.name} drew ${room.currentPenalty} cards!`;
    room.currentPenalty = 0;
    checkEliminations(room, io);
    room.currentPlayerIndex = nextPlayerIndex(room, 1);
  room.turnStartTime = Date.now();
  } else {
    if (room.mode === 'no-mercy') {
       let limit = 0;
       let drawnCard = null;
       const topCard = room.discardPile[room.discardPile.length - 1];
       while(limit < 10) {
         const drawn = drawCards(room, 1);
         if (drawn.length > 0) {
           player.hand.push(drawn[0]);
           player.unoCalled = false;
           if (drawn[0].color === room.currentColor || drawn[0].color === 'wild' || drawn[0].value === topCard.value) {
             drawnCard = drawn[0];
             break;
           }
         } else {
            break;
         }
         limit++;
       }
       if (drawnCard) {
           room.lastActionMessage = `${player.name} drew until a playable card`;
           room.drawnCardThisTurn = drawnCard;
       } else {
           room.lastActionMessage = `${player.name} drew 10 cards and passed`;
           room.currentPlayerIndex = nextPlayerIndex(room, 1);
  room.turnStartTime = Date.now();
       }
       checkEliminations(room, io);
    } else {
      const drawn = drawCards(room, 1);
      if (drawn.length > 0) {
          player.hand.push(drawn[0]);
          player.unoCalled = false;
          room.drawnCardThisTurn = drawn[0];
          room.lastActionMessage = `${player.name} drew a card`;
          checkEliminations(room, io);
      } else {
          room.lastActionMessage = `No cards left! ${player.name} passed automatically.`;
          room.currentPlayerIndex = nextPlayerIndex(room, 1);
          room.turnStartTime = Date.now();
      }
    }
  }
  
  if (room.players[room.currentPlayerIndex].eliminated) {
      room.drawnCardThisTurn = null;
      room.currentPlayerIndex = nextPlayerIndex(room, 1);
      room.turnStartTime = Date.now();
  }
  io.to(roomId).emit("state_update", room);
  triggerBotIfTurn(roomId, io);
  triggerBotIfTurn(roomId, io);
}


function executePlay7(roomId: string, io: Server, playerIndex: number, targetPlayerId: string, cardId: string, chosenColor?: CardColor, socket?: Socket) {
   const room = rooms.get(roomId);
   if (!room || room.status !== 'playing') return;
       if (room.mode !== 'no-mercy' && !room.rule70Enabled) return;

   const p1Idx = playerIndex;
   const p2Idx = room.players.findIndex(p => p.id === targetPlayerId);
   
   if (p1Idx === -1 || p2Idx === -1) return;
   const p1 = room.players[p1Idx];
   const p2 = room.players[p2Idx];
   if (p2.eliminated) {
      socket?.emit("error", "Cannot swap with eliminated player");
      return;
   }
   
   const isTurn = p1Idx === room.currentPlayerIndex;
   const cardIndex = p1.hand.findIndex(c => c.id === cardId);
   if (cardIndex === -1) return;
   const card = p1.hand[cardIndex];
   const topCard = room.discardPile[room.discardPile.length - 1];
   if (card.value !== '7') return;
   if (room.currentPenalty > 0) {
      socket?.emit("error", "Cannot play 7 during a penalty stack");
      return;
   }
   
   const isExactMatch = card.color === topCard.color && card.value === topCard.value && card.color !== 'wild';
   const canJumpIn = room.jumpInEnabled && !isTurn && isExactMatch && room.currentPenalty === 0 && !room.drawnCardThisTurn && room.jumpInExpiry && Date.now() <= room.jumpInExpiry;

   if (!isTurn && !canJumpIn) {
      socket?.emit("error", "Not your turn");
      return;
   }
   if (isTurn && room.drawnCardThisTurn && room.drawnCardThisTurn.id !== cardId) {
      socket?.emit("error", "You can only play the drawn card or pass");
      return;
   }
   if (canJumpIn) {
      room.currentPlayerIndex = p1Idx;
      room.turnStartTime = Date.now();
      room.lastActionMessage = `${p1.name} jumped in!`;
   }
   const isValidColor = card.color === room.currentColor || card.color === 'wild';
   const isValidValue = card.value === topCard.value;
   if (!isValidColor && !isValidValue) return;

   if (card.color === 'wild' && !chosenColor) {
     socket?.emit("error", "Must choose a color for wild card");
     return;
   }

   // Play card
   p1.hand.splice(cardIndex, 1);
   room.discardPile.push(card);
   room.currentColor = (card.color === 'wild' && chosenColor) ? chosenColor : card.color;
   room.drawnCardThisTurn = null;
   
   if (p1.hand.length === 0) {
      room.status = 'finished';
      room.winner = p1.name;
      room.lastActionMessage = `${p1.name} played 7 as their last card and won!`;
      io.to(roomId).emit("state_update", room);
      return;
   }
   
   // Swap
   const temp = p1.hand;
   p1.hand = p2.hand;
   p2.hand = temp;
   if (p1.hand.length > 1) p1.unoCalled = false;
   if (p2.hand.length > 1) p2.unoCalled = false;

   room.lastActionMessage = `${p1.name} played 7 and swapped hands with ${p2.name}!`;

  if (p2.hand.length === 0) {
    room.status = 'finished';
    room.winner = p2.name;
  } else {
    room.currentPlayerIndex = nextPlayerIndex(room, 1);
  room.turnStartTime = Date.now();
  }

  io.to(roomId).emit("state_update", room);
  triggerBotIfTurn(roomId, io);
}

function executeBotMove(roomId: string, io: Server) {
  const room = rooms.get(roomId);
  if (!room || room.status !== 'playing') return;

  const playerIndex = room.currentPlayerIndex;
  const player = room.players[playerIndex];
  if (!player || !player.isBot) return;
  
  // 1. Check if bot needs to call UNO
  if (player.hand.length <= 2 && !player.unoCalled) {
      player.unoCalled = true;
      room.lastActionMessage = `${player.name} yelled UNO!`;
  }
  
  // 2. Catch anyone else
  for (const p of room.players) {
      if (p.id !== player.id && p.hand.length === 1 && !p.unoCalled) {
          const drawn = drawCards(room, 2);
          p.hand.push(...drawn);
          p.unoCalled = false;
          room.lastActionMessage = `${player.name} caught ${p.name} not saying UNO! +2 cards`;
          checkEliminations(room, io);
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
  room.turnStartTime = Date.now();
          room.lastActionMessage = `${player.name} passed.`;
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

function triggerBotIfTurn(roomId: string, io: Server) {
  const room = rooms.get(roomId);
  if (!room || room.status !== 'playing') return;

  const currentPlayer = room.players[room.currentPlayerIndex];
  if (!currentPlayer || !currentPlayer.isBot) return;

  setTimeout(() => {
    executeBotMove(roomId, io);
  }, room.botSpeed || 1500);
}

function drawCards(room: GameState, count: number): Card[] {
  const drawn: Card[] = [];
  for (let i = 0; i < count; i++) {
    if (room.deck.length === 0) {
      if (room.discardPile.length <= 1) break; // No cards left to shuffle
      const topDiscard = room.discardPile.pop()!;
      room.deck = room.discardPile.sort(() => Math.random() - 0.5);
      // Reset wildcard colors on reshuffle
      room.deck.forEach(c => {
        if (c.value === 'wild' || c.value === 'draw4') c.color = 'wild';
      });
      room.discardPile = [topDiscard];
    }
    drawn.push(room.deck.pop()!);
  }
  return drawn;
}

export function setupGameLogic(io: Server) {
  setInterval(() => {
    rooms.forEach((room, roomId) => {
        if (room.status === 'playing' && room.turnTimeLimit && room.turnTimeLimit > 0) {
            if (room.turnStartTime && Date.now() - room.turnStartTime > room.turnTimeLimit * 1000) {
                const player = room.players[room.currentPlayerIndex];
                if (player && !player.isBot) {
                   if (room.currentPenalty > 0) {
                      const drawn = drawCards(room, room.currentPenalty);
                      player.hand.push(...drawn);
                      room.currentPenalty = 0;
                      room.lastActionMessage = `${player.name} ran out of time and drew penalty cards!`;
                   } else if (!room.drawnCardThisTurn) {
                      const drawn = drawCards(room, 1);
                      if (drawn.length > 0) player.hand.push(drawn[0]);
                      room.lastActionMessage = `${player.name} ran out of time and drew a card!`;
                   } else {
                      room.lastActionMessage = `${player.name} ran out of time and passed!`;
                   }
                   
                   room.drawnCardThisTurn = null;
                   player.unoCalled = false;
                   checkEliminations(room, io);
                   
                   if (room.status === 'playing') {
                       room.currentPlayerIndex = nextPlayerIndex(room, 1);
                       room.turnStartTime = Date.now();
                       io.to(roomId).emit("state_update", room);
                       triggerBotIfTurn(roomId, io);
                   }
                }
            }
        }
    });
  }, 1000);

  io.on("connection", (socket: Socket) => {
    console.log("Client connected", socket.id);
    
    socket.on("join_room", ({ roomId, name, mode }: { roomId: string; name: string, mode?: GameMode }) => {
      let room = rooms.get(roomId);
      if (!room) {
        room = createRoom(roomId, mode || 'normal');
      }

      if (room.players.length >= 10 && !room.players.find(p => p.id === socket.id || p.name === name)) {
         socket.emit("error", "Room is full (max 10 players)");
         return;
      }

      socket.join(roomId);
      
      const existingPlayer = room.players.find(p => p.name === name);
      if (existingPlayer) {
        // Reconnect
        existingPlayer.id = socket.id;
        existingPlayer.connected = true;
        room.lastActionMessage = `${name} reconnected`;
      } else {
        if (room.status !== 'lobby') {
           socket.emit("error", "Game already in progress");
           return;
        }
        room.players.push({
          id: socket.id,
          name,
          hand: [],
          isHost: room.players.length === 0,
          connected: true
        });
        room.lastActionMessage = `${name} joined`;
      }

      io.to(roomId).emit("state_update", room);
    });

    socket.on("start_game", (roomId: string) => {
      const room = rooms.get(roomId);
      if (!room) return;
      
      const player = room.players.find(p => p.id === socket.id);
      if (!player || !player.isHost || room.status !== 'lobby') return;
      if (room.players.length < 2) {
         socket.emit("error", "Need at least 2 players");
         return;
      }

      room.deck = generateDeck();
      room.players.forEach(p => p.hand = drawCards(room, 7));
      
      let topCard = room.deck.pop()!;
      while (topCard.color === 'wild') {
        room.deck.unshift(topCard);
        topCard = room.deck.pop()!;
      }
      room.discardPile = [topCard];
      room.currentColor = topCard.color;
      
      room.status = 'playing';
      room.turnStartTime = Date.now();
      room.currentPlayerIndex = 0;
  room.turnStartTime = Date.now(); // Host starts
      room.direction = 1;
      room.currentPenalty = 0;
      room.winner = null;
      room.lastActionMessage = 'Game started!';

      io.to(roomId).emit("state_update", room);
      triggerBotIfTurn(roomId, io);
    });

    
    socket.on("pass_turn", (roomId: string) => {
        const room = rooms.get(roomId);
        if (!room || room.status !== 'playing') return;
        const playerIndex = room.players.findIndex(p => p.id === socket.id);
        if (playerIndex === -1 || playerIndex !== room.currentPlayerIndex) return;
        if (room.drawnCardThisTurn) {
            if (room.forcePlayEnabled) {
                const card = room.drawnCardThisTurn;
                const topCard = room.discardPile[room.discardPile.length - 1];
                let valid = false;
                const isStacking = room.currentPenalty > 0;
                if (isStacking && room.stackingEnabled) {
                   if (topCard.value === 'draw4' && card.value === 'draw4') valid = true;
                   if (topCard.value === 'draw2' && (card.value === 'draw2' || card.value === 'draw4')) valid = true;
                } else if (!isStacking) {
                   if (card.color === room.currentColor || card.color === 'wild' || card.value === topCard.value) valid = true;
                }
                if (valid) {
                    socket.emit("error", "You must play the drawn card (Force Play enabled)");
                    return;
                }
            }
            room.drawnCardThisTurn = null;
            room.currentPlayerIndex = nextPlayerIndex(room, 1);
  room.turnStartTime = Date.now();
            room.lastActionMessage = `${room.players[playerIndex].name} passed.`;
            io.to(roomId).emit("state_update", room);
            triggerBotIfTurn(roomId, io);
        }
    });

    socket.on("play_again", (roomId: string) => {
        const room = rooms.get(roomId);
        if (!room) return;
        
        const player = room.players.find(p => p.id === socket.id);
        if (!player || !player.isHost) return;

        // Reset room state
        room.status = 'lobby';
        room.discardPile = [];
        room.deck = [];
        room.direction = 1;
        room.currentPenalty = 0;
        room.drawnCardThisTurn = null;
        room.lastActionMessage = undefined;
        room.winner = undefined;
        // Keep players but reset their state
        room.players = room.players.map(p => ({
            ...p,
            hand: [],
            unoCalled: false,
            eliminated: false,
        }));
        
        io.to(roomId).emit("state_update", room);
    });

    socket.on("call_uno", (roomId: string) => {
        const room = rooms.get(roomId);
        if (!room || room.status !== 'playing') return;
        const player = room.players.find(p => p.id === socket.id);
        if (!player) return;
        if (player.hand.length <= 2 && !player.unoCalled) {
            player.unoCalled = true;
            room.lastActionMessage = `${player.name} yelled UNO!`;
            io.to(roomId).emit("state_update", room);
        }
    });

    socket.on("catch_uno", ({roomId, targetId}: {roomId: string, targetId: string}) => {
        const room = rooms.get(roomId);
        if (!room || room.status !== 'playing') return;
        const target = room.players.find(p => p.id === targetId);
        if (!target) return;
        if (target.hand.length === 1 && !target.unoCalled) {
            const drawn = drawCards(room, 2);
            target.hand.push(...drawn);
            target.unoCalled = false;
            room.lastActionMessage = `${target.name} was caught not saying UNO and drew 2!`;
            checkEliminations(room, io);
            io.to(roomId).emit("state_update", room);
        }
    });

            socket.on("update_settings", ({roomId, limit, jumpIn, mode, rule70Enabled, forcePlayEnabled, botSpeed, turnTimeLimit}: {roomId: string, limit: number, jumpIn: boolean, mode?: 'normal' | 'no-mercy', rule70Enabled?: boolean, forcePlayEnabled?: boolean, botSpeed?: number, turnTimeLimit?: number}) => {
       const room = rooms.get(roomId);
       if (!room) return;
       const player = room.players.find(p => p.id === socket.id);
       if (!player || !player.isHost) return;
       if (room.status !== 'lobby') return;
       room.eliminationLimit = limit;
       room.jumpInEnabled = jumpIn;
       
       if (rule70Enabled !== undefined) room.rule70Enabled = rule70Enabled;
       if (forcePlayEnabled !== undefined) room.forcePlayEnabled = forcePlayEnabled;
       if (botSpeed !== undefined) room.botSpeed = botSpeed;
       if (turnTimeLimit !== undefined) room.turnTimeLimit = turnTimeLimit;

       if (mode) {
           room.mode = mode;
           room.stackingEnabled = mode === 'no-mercy';
       }
       io.to(roomId).emit("state_update", room);
    });

        socket.on("add_bot", (roomId: string) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const player = room.players.find(p => p.id === socket.id);
      if (!player || !player.isHost) return;
      if (room.status !== 'lobby' || room.players.length >= 10) return;
      
      const botNames = ['Bot Alpha', 'Bot Beta', 'Bot Gamma', 'Bot Delta', 'Bot Epsilon'];
      const personalities = ['normal', 'aggressive', 'hoarder'];
      const botPersonality = personalities[Math.floor(Math.random() * personalities.length)] as 'normal' | 'aggressive' | 'hoarder';

      const bot: Player = {
        id: `bot_${Math.random().toString(36).substr(2, 9)}`,
        name: botNames[room.players.length % botNames.length] + ` (${botPersonality})`,
        hand: [],
        isHost: false,
        connected: true,
        isBot: true,
        botPersonality,
      };
      room.players.push(bot);
      const botIndex = room.players.filter(p => p.isBot).length;
      room.lastActionMessage = `Bot ${botIndex} joined`;
      io.to(roomId).emit("state_update", room);
    });
    socket.on("remove_player", ({roomId, targetId}: {roomId: string, targetId: string}) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const player = room.players.find(p => p.id === socket.id);
      if (!player || !player.isHost) return;
      if (room.status !== 'lobby') return;
      
      const targetIndex = room.players.findIndex(p => p.id === targetId);
      if (targetIndex !== -1 && targetId !== socket.id) {
         room.players.splice(targetIndex, 1);
         io.to(roomId).emit("state_update", room);
      }
    });


    socket.on("play_card", ({ roomId, cardId, chosenColor }: { roomId: string; cardId: string; chosenColor?: CardColor }) => {
      const room = rooms.get(roomId);
      if (!room || room.status !== 'playing') return;
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex === -1) return;
      executePlayCard(roomId, io, playerIndex, cardId, chosenColor, socket);
    });

    socket.on("draw_card", (roomId: string) => {
    const r = rooms.get(roomId);
    if (r) r.lastPlayTime = 0;
      const room = rooms.get(roomId);
      if (!room || room.status !== 'playing') return;
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex === -1) return;
      executeDrawCard(roomId, io, playerIndex);
    });

    socket.on("chat_message", ({ roomId, message }: { roomId: string; message: string }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const player = room.players.find(p => p.id === socket.id);
      if (!player) return;

      room.chat.push({
        id: Math.random().toString(),
        senderName: player.name,
        message,
        timestamp: Date.now()
      });

      // Keep last 50 messages
      if (room.chat.length > 50) room.chat.shift();
      
      io.to(roomId).emit("state_update", room);
    });
    
    // In No Mercy, 7 swaps hand with selected player
    socket.on("swap_hand", ({ roomId, targetPlayerId, cardId, chosenColor }: { roomId: string, targetPlayerId: string, cardId: string, chosenColor?: CardColor }) => {
       const room = rooms.get(roomId);
       if (!room || room.status !== 'playing') return;
       if (room.mode !== 'no-mercy' && !room.rule70Enabled) return;
       const playerIndex = room.players.findIndex(p => p.id === socket.id);
       if (playerIndex === -1) return;
       executePlay7(roomId, io, playerIndex, targetPlayerId, cardId, chosenColor, socket);
    });


    socket.on("sort_hand", (roomId: string) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const player = room.players.find(p => p.id === socket.id);
      if (!player) return;
      
      player.hand.sort((a, b) => {
        if (a.color !== b.color) return a.color.localeCompare(b.color);
        return a.value.localeCompare(b.value);
      });
      io.to(roomId).emit("state_update", room);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      rooms.forEach((room, roomId) => {
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
          player.connected = false;
          room.lastActionMessage = `${player.name} disconnected`;
          
          if (room.players.every(p => !p.connected || p.isBot)) {
            rooms.delete(roomId); // Clean up empty room if no humans left
          } else {
             const playerIndex = room.players.findIndex(p => p.id === socket.id);
             if (playerIndex === room.currentPlayerIndex && room.status === 'playing') {
                   if (room.currentPenalty > 0) {
                      const drawn = drawCards(room, room.currentPenalty);
                      player.hand.push(...drawn);
                      room.currentPenalty = 0;
                      room.lastActionMessage = `${player.name} disconnected and drew penalty cards!`;
                   } else if (!room.drawnCardThisTurn) {
                      const drawn = drawCards(room, 1);
                      if (drawn.length > 0) player.hand.push(drawn[0]);
                      room.lastActionMessage = `${player.name} disconnected and drew a card!`;
                   } else {
                      room.lastActionMessage = `${player.name} disconnected and passed!`;
                   }
                   
                   room.drawnCardThisTurn = null;
                   player.unoCalled = false;
                   checkEliminations(room, io);
                   
                   if (room.status === 'playing') {
                       room.currentPlayerIndex = nextPlayerIndex(room, 1);
                       room.turnStartTime = Date.now();
                       setTimeout(() => triggerBotIfTurn(roomId, io), 50);
                   }
             }
             io.to(roomId).emit("state_update", room);
          }
        }
      });
    });
  });
}

