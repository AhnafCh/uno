const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const oldEffect = `  useEffect(() => {
    let animationFrameId: number;
    const updateTime = () => {
      setNow(Date.now());
      animationFrameId = requestAnimationFrame(updateTime);
    };
    if (gameState.jumpInExpiry && gameState.jumpInExpiry > syncedNow) {
      updateTime();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState.jumpInExpiry]);`;

const newEffect = `  useEffect(() => {
    let animationFrameId: number;
    const offset = timeOffset;
    const expiry = gameState.jumpInExpiry;
    
    const updateTime = () => {
      const current = Date.now();
      setNow(current);
      if (expiry && expiry > current + offset) {
        animationFrameId = requestAnimationFrame(updateTime);
      }
    };
    
    if (expiry && expiry > Date.now() + offset) {
      updateTime();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState.jumpInExpiry, timeOffset]);`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Fixed requestAnimationFrame leak");
