const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const oldLobbyRegex = /\{gameState\.status === 'lobby' \? \([\s\S]*?\) \: \(\s*<p className="text-neutral-400 animate-pulse">Waiting for host to start\.\.\.<\/p>\s*\)\}\s*<\/div>\s*\)\s*:\s*\(\s*<div className="flex-1 flex flex-col items-center justify-center p-4">/m;

// wait, the old lobby code spans a large area.
// let's grab exactly the lobby part.
