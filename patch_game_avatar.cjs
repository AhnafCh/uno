const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const avatarsCode = `
const AVATARS = [
  "https://api.dicebear.com/9.x/bottts/svg?seed=Felix",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Jasper",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Midnight",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Snowball",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Toby",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Ginger",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Oliver",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Milo",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Leo",
  "https://api.dicebear.com/9.x/bottts/svg?seed=Simba"
];

function getUnusedAvatar(room) {
    const usedAvatars = new Set(room.players.map(p => p.avatar));
    const availableAvatars = AVATARS.filter(a => !usedAvatars.has(a));
    return availableAvatars.length > 0 ? availableAvatars[Math.floor(Math.random() * availableAvatars.length)] : AVATARS[0];
}
`;

// Insert after imports
code = code.replace(/import \{.*?\} from "socket\.io";/, match => match + avatarsCode);

// Fix join_room
const joinTargetRegex = /        const isHost = room\.players\.length === 0;\s*room\.players\.push\(\{[\s\S]*?isHost,\s*connected: true\s*\}\);/;
const joinReplacement = `        const isHost = room.players.length === 0;
        room.players.push({
          id: socket.id,
          name,
          avatar: getUnusedAvatar(room),
          hand: [],
          isHost,
          connected: true
        });`;
code = code.replace(joinTargetRegex, joinReplacement);

// Fix add_bot
const botTargetRegex = /      const bot: Player = \{\s*id: \`bot_\$\{Math\.random\(\)\.toString\(36\)\.substr\(2, 9\)\}\`,\s*name: botNames\[room\.players\.length % botNames\.length\] \+ \` \(\$\{botPersonality\}\)\`,\s*hand: \[\],\s*isHost: false,\s*connected: true,\s*isBot: true,\s*botPersonality,\s*\};/;
const botReplacement = `      const bot: Player = {
        id: \`bot_\${Math.random().toString(36).substr(2, 9)}\`,
        name: botNames[room.players.length % botNames.length] + \` (\${botPersonality})\`,
        avatar: getUnusedAvatar(room),
        hand: [],
        isHost: false,
        connected: true,
        isBot: true,
        botPersonality,
      };`;
code = code.replace(botTargetRegex, botReplacement);

fs.writeFileSync('src/server/game.ts', code);
