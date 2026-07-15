const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const oldEffect = `  useEffect(() => {
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

const newEffect = `  useEffect(() => {
    let animationFrameId: number;
    
    const updateTime = () => {
      setNow(Date.now());
      animationFrameId = requestAnimationFrame(updateTime);
    };
    
    if (gameState.status === 'playing') {
       animationFrameId = requestAnimationFrame(updateTime);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState.status]);`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Fixed main timer loop");
