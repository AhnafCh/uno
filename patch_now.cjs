const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

code = code.replace(/const \[now, setNow\] = useState\(Date\.now\(\)\);/, 'const [now, setNow] = useState(Date.now());\n  const [timeOffset, setTimeOffset] = useState(0);\n  useEffect(() => { if (gameState.serverNow) setTimeOffset(gameState.serverNow - Date.now()); }, [gameState.serverNow]);\n  const syncedNow = now + timeOffset;');

code = code.replace(/if \(gameState\.jumpInExpiry && gameState\.jumpInExpiry > Date\.now\(\)\) \{/g, 'if (gameState.jumpInExpiry && gameState.jumpInExpiry > syncedNow) {');
code = code.replace(/now <= gameState.jumpInExpiry/g, 'syncedNow <= gameState.jumpInExpiry');
code = code.replace(/gameState\.jumpInExpiry - now/g, 'gameState.jumpInExpiry - syncedNow');
code = code.replace(/const elapsed = \(Date\.now\(\) - gameState\.turnStartTime!\) \/ 1000;/g, 'const elapsed = (syncedNow - gameState.turnStartTime!) / 1000;');

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Fixed now sync");
