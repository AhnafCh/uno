const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

code = code.replace(
    /socket\.on\("update_settings", \(\{roomId, limit, winLimit, jumpIn, mode, rule70Enabled, forcePlayEnabled, botSpeed, turnTimeLimit\}: \{roomId: string, limit: number, winLimit\?: number, jumpIn: boolean, mode\?: 'normal' \| 'no-mercy', rule70Enabled\?: boolean, forcePlayEnabled\?: boolean, botSpeed\?: number, turnTimeLimit\?: number\}\) => \{/,
    "socket.on(\"update_settings\", ({roomId, limit, winLimit, jumpIn, mode, rule70Enabled, forcePlayEnabled, botSpeed, turnTimeLimit, stackingEnabled}: {roomId: string, limit: number, winLimit?: number, jumpIn: boolean, mode?: 'normal' | 'no-mercy', rule70Enabled?: boolean, forcePlayEnabled?: boolean, botSpeed?: number, turnTimeLimit?: number, stackingEnabled?: boolean}) => {"
);

code = code.replace(
    /if \(turnTimeLimit \!== undefined\) room\.turnTimeLimit = turnTimeLimit;\s*if \(mode\) \{\s*room\.mode = mode;\s*room\.stackingEnabled = mode === 'no-mercy';\s*\}/,
    "if (turnTimeLimit !== undefined) room.turnTimeLimit = turnTimeLimit;\n\n       if (stackingEnabled !== undefined) room.stackingEnabled = stackingEnabled;\n\n       if (mode) {\n           room.mode = mode;\n           if (mode === 'no-mercy') room.stackingEnabled = true;\n       }"
);

fs.writeFileSync('src/server/game.ts', code);
console.log("Patched update_settings in server");
