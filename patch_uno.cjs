const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const targetRegex = /socket\.on\("call_uno", \(roomId: string\) => \{[\s\S]*?if \(!player\) return;/;
const replacement = `    socket.on("call_uno", (roomId: string) => {
        const room = rooms.get(roomId);
        if (!room || room.status !== 'playing') return;
        const playerIndex = room.players.findIndex(p => p.id === socket.id);
        if (playerIndex === -1) return;
        if (playerIndex !== room.currentPlayerIndex) {
            socket.emit("error", "You can only call UNO on your turn.");
            return;
        }
        const player = room.players[playerIndex];`;

if (code.match(targetRegex)) {
    console.log("Found call_uno block");
    code = code.replace(targetRegex, replacement);
} else {
    console.log("Could not find call_uno block");
}

fs.writeFileSync('src/server/game.ts', code);
