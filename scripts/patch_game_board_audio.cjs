const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

if (!code.includes('import { useAudio }')) {
  code = code.replace(/import \{.*\} from 'react';/, "import { useState, useEffect, useRef } from 'react';\nimport { useAudio } from '../useAudio';\nimport { motion, AnimatePresence } from 'motion/react';");
}

const audioHook = `  const { playSound } = useAudio();
  const prevDiscardLength = useRef(gameState.discardPile?.length || 0);
  const prevHandLength = useRef(0);
  
  useEffect(() => {
     if (gameState.discardPile && gameState.discardPile.length > prevDiscardLength.current) {
         playSound('play');
     }
     prevDiscardLength.current = gameState.discardPile?.length || 0;
  }, [gameState.discardPile?.length, playSound]);

  useEffect(() => {
     if (myPlayer) {
         if (myPlayer.hand.length > prevHandLength.current) {
             playSound('draw');
         }
         prevHandLength.current = myPlayer.hand.length;
     }
  }, [myPlayer?.hand.length, playSound]);
`;

if (!code.includes('const { playSound }')) {
  code = code.replace(/const myPlayer = gameState\.players\[myPlayerIndex\];/, "const myPlayer = gameState.players[myPlayerIndex];\n" + audioHook);
}

fs.writeFileSync('src/components/GameBoard.tsx', code);
