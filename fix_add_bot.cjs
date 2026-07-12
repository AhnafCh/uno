const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

const brokenAddBot = /    socket\.on\("add_bot"[\s\S]*?room\.lastActionMessage = `Bot \$\{botIndex\} joined`;\s*io\.to\(roomId\)\.emit\("state_update", room\);\s*\}\);/m;

const addBotHtml = `    socket.on("add_bot", (roomId: string) => {
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
      const botIndex = room.players.filter(p => p.isBot).length;
      room.lastActionMessage = \`Bot \${botIndex} joined\`;
      io.to(roomId).emit("state_update", room);
    });`;

code = code.replace(brokenAddBot, addBotHtml);
fs.writeFileSync('src/server/game.ts', code);
