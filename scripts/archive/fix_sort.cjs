const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

const sortButtonSearch = `<button 
                  onClick={() => socket.emit('sort_hand', gameState.id)}`;
const sortButtonReplace = `{!myPlayer.eliminated && !myPlayer.hasFinished && <button 
                  onClick={() => socket.emit('sort_hand', gameState.id)}`;

gameBoard = gameBoard.replace(sortButtonSearch, sortButtonReplace);
fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
console.log("Fixed sort button");
