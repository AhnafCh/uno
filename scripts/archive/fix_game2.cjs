const fs = require('fs');
let game = fs.readFileSync('src/server/game.ts', 'utf8');

// Add winLimit default
game = game.replace(`eliminationLimit: 20,`, `eliminationLimit: 20,\n    winLimit: 1,`);

// Update checkWinner to use winLimit
const checkWinnerOld = `    if (remainingActive.length <= 1 && room.players.length > 1) {
        if (remainingActive.length === 1) {
             const p = remainingActive[0];
             const place = (room.winners?.length || 0) + 1;
             p.finishedPlace = place;
             if (!room.winners) room.winners = [];
             room.winners.push({ name: p.name, place });
        }
        room.status = 'finished';
        io.to(room.id).emit("state_update", room);
        return true;
    }`;

const checkWinnerNew = `    const winLimit = room.winLimit || 1;
    const isGameFinished = (remainingActive.length <= 1 && room.players.length > 1) || (room.winners?.length >= winLimit);
    
    if (isGameFinished) {
        // If there's only 1 active left and it's a game end, give them the last place
        if (remainingActive.length === 1) {
             const p = remainingActive[0];
             const place = (room.winners?.length || 0) + 1;
             p.finishedPlace = place;
             if (!room.winners) room.winners = [];
             room.winners.push({ name: p.name, place });
        }
        room.status = 'finished';
        io.to(room.id).emit("state_update", room);
        return true;
    }`;

game = game.replace(checkWinnerOld, checkWinnerNew);

game = game.replace(`update_settings", ({roomId, limit, jumpIn, mode, rule70Enabled, forcePlayEnabled, botSpeed, turnTimeLimit}`, `update_settings", ({roomId, limit, winLimit, jumpIn, mode, rule70Enabled, forcePlayEnabled, botSpeed, turnTimeLimit}`);
game = game.replace(`room.eliminationLimit = limit;`, `room.eliminationLimit = limit;\n       if (winLimit !== undefined) room.winLimit = winLimit;`);

fs.writeFileSync('src/server/game.ts', game);
console.log('Fixed game2.cjs');
