const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const targetCheckWinner = /        if \(remainingActive\.length === 1\) \{\s*const p = remainingActive\[0\];\s*const place = \(room\.winners\?\.length \|\| 0\) \+ 1;\s*p\.finishedPlace = place;\s*if \(\!room\.winners\) room\.winners = \[\];\s*room\.winners\.push\(\{ name: p\.name, place \}\);\s*\}/;

const replacementCheckWinner = `        if (remainingActive.length === 1) {
             const p = remainingActive[0];
             const place = (room.winners?.length || 0) + 1;
             p.finishedPlace = place;
             if (!room.winners) room.winners = [];
             room.winners.push({ name: p.name, place });
             if (!room.winner) room.winner = p.name;
        }`;

if (code.match(targetCheckWinner)) {
    console.log("Found checkWinner block");
    code = code.replace(targetCheckWinner, replacementCheckWinner);
    fs.writeFileSync('src/server/game.ts', code);
} else {
    console.log("Could not find checkWinner block");
}
