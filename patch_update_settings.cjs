const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf8');

code = code.replace(/socket\.on\("update_settings", \(\{roomId, limit, jumpIn, mode, rule70Enabled, forcePlayEnabled\}\: \{roomId: string, limit: number, jumpIn: boolean, mode\?: 'normal' \| 'no-mercy', rule70Enabled\?: boolean, forcePlayEnabled\?: boolean\}\) => \{/, "socket.on(\"update_settings\", ({roomId, limit, jumpIn, mode, rule70Enabled, forcePlayEnabled, botSpeed, turnTimeLimit}: {roomId: string, limit: number, jumpIn: boolean, mode?: 'normal' | 'no-mercy', rule70Enabled?: boolean, forcePlayEnabled?: boolean, botSpeed?: number, turnTimeLimit?: number}) => {");

code = code.replace(/if \(forcePlayEnabled !== undefined\) room\.forcePlayEnabled = forcePlayEnabled;/, "if (forcePlayEnabled !== undefined) room.forcePlayEnabled = forcePlayEnabled;\n       if (botSpeed !== undefined) room.botSpeed = botSpeed;\n       if (turnTimeLimit !== undefined) room.turnTimeLimit = turnTimeLimit;");

fs.writeFileSync('src/server/game.ts', code);
