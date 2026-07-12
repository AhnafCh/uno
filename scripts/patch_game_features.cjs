const fs = require('fs');

let code = fs.readFileSync('src/server/game.ts', 'utf8');

// 1. Update update_settings
let updateSettingsHtml = `    socket.on("update_settings", ({roomId, limit, jumpIn, mode, rule70Enabled, forcePlayEnabled}: {roomId: string, limit: number, jumpIn: boolean, mode?: 'normal' | 'no-mercy', rule70Enabled?: boolean, forcePlayEnabled?: boolean}) => {
       const room = rooms.get(roomId);
       if (!room) return;
       const player = room.players.find(p => p.id === socket.id);
       if (!player || !player.isHost) return;
       if (room.status !== 'lobby') return;
       room.eliminationLimit = limit;
       room.jumpInEnabled = jumpIn;
       
       if (rule70Enabled !== undefined) room.rule70Enabled = rule70Enabled;
       if (forcePlayEnabled !== undefined) room.forcePlayEnabled = forcePlayEnabled;

       if (mode) {
           room.mode = mode;
           room.stackingEnabled = mode === 'no-mercy';
       }
       io.to(roomId).emit("state_update", room);
    });`;

code = code.replace(/socket\.on\("update_settings", \([\s\S]*?\}\);/, updateSettingsHtml);

// 2. Add bot personalities when adding bot
let addBotHtml = `    socket.on("add_bot", (roomId: string) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const player = room.players.find(p => p.id === socket.id);
      if (!player || !player.isHost) return;
      if (room.status !== 'lobby' || room.players.length >= 10) return;
      
      const botNames = ['Bot Alpha', 'Bot Beta', 'Bot Gamma', 'Bot Delta', 'Bot Epsilon'];
      const personalities = ['normal', 'aggressive', 'hoarder'];
      const botPersonality = personalities[Math.floor(Math.random() * personalities.length)] as 'normal' | 'aggressive' | 'hoarder';

      const bot: Player = {
        id: \`bot_\${Math.random().toString(36).substr(2, 9)}\`,
        name: botNames[room.players.length % botNames.length] + \` (\${botPersonality})\`,
        hand: [],
        isHost: false,
        connected: true,
        isBot: true,
        botPersonality,
      };
      room.players.push(bot);
      io.to(roomId).emit("state_update", room);
    });`;

code = code.replace(/socket\.on\("add_bot", \([\s\S]*?\}\);/, addBotHtml);

// 3. Add Chat message handling
const chatHandling = `
    socket.on("chat_message", ({roomId, message}: {roomId: string, message: string}) => {
        const room = rooms.get(roomId);
        if (!room) return;
        const player = room.players.find(p => p.id === socket.id);
        if (!player) return;

        room.chat.push({
            id: Math.random().toString(36).substring(7),
            senderName: player.name,
            message,
            timestamp: Date.now()
        });
        if (room.chat.length > 50) {
            room.chat.shift();
        }
        io.to(roomId).emit("state_update", room);
    });
`;
code = code.replace(/socket\.on\("disconnect", \(\) => \{/, chatHandling + '\n    socket.on("disconnect", () => {');

fs.writeFileSync('src/server/game.ts', code);
