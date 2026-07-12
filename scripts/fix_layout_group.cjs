const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// Remove existing LayoutGroup
code = code.replace(/<LayoutGroup>\s*<div className="flex-1 relative overflow-hidden flex flex-col">/g, '<div className="flex-1 relative overflow-hidden flex flex-col">');

// We will wrap the ENTIRE game area (or just return) in LayoutGroup!
// It's much safer to wrap the outermost return in GameBoard.tsx.
const searchReturn = `return (
    <div className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_center,_#1c1c24_0%,_#0a0a0c_80%)]">`;
const replaceReturn = `return (
    <LayoutGroup>
    <div className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_center,_#1c1c24_0%,_#0a0a0c_80%)]">`;
code = code.replace(searchReturn, replaceReturn);

const searchEnd = `      {/* Chat Sidebar */}
      <Chat gameState={gameState} socketId={socketId} />
    </div>
  );`;
const replaceEnd = `      {/* Chat Sidebar */}
      <Chat gameState={gameState} socketId={socketId} />
    </div>
    </LayoutGroup>
  );`;
code = code.replace(searchEnd, replaceEnd);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Fixed LayoutGroup");
