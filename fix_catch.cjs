const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const catchUnoSearch = `<button onClick={() => socket.emit('catch_uno', {roomId: gameState.id, targetId: p.id})} className="mt-2 text-[10px] bg-red-600 hover:bg-red-500 font-bold px-2 py-1 rounded text-white animate-pulse">`;
const catchUnoReplace = `<button onClick={() => socket.emit('catch_uno', {roomId: gameState.id, targetId: p.id})} className="mt-2 text-xs bg-red-600 hover:bg-red-500 font-black px-4 py-1.5 rounded-full text-white animate-bounce shadow-[0_0_15px_rgba(220,38,38,0.8)] border border-red-400 absolute -bottom-10 z-50 whitespace-nowrap">`;

gameBoard = gameBoard.replace(catchUnoSearch, catchUnoReplace);
fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
console.log("Fixed catch uno");
