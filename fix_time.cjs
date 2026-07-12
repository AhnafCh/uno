const fs = require('fs');
let gameBoard = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

// Add state
gameBoard = gameBoard.replace('const [chatMsg, setChatMsg] = useState("");', 'const [chatMsg, setChatMsg] = useState("");\n  const [now, setNow] = useState(Date.now());');

// Add effect to update time
const effect = `
  useEffect(() => {
    let animationFrameId: number;
    const updateTime = () => {
      setNow(Date.now());
      animationFrameId = requestAnimationFrame(updateTime);
    };
    if (gameState.jumpInExpiry && gameState.jumpInExpiry > Date.now()) {
      updateTime();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState.jumpInExpiry]);
`;
gameBoard = gameBoard.replace('useEffect(() => {\n     if (chatRef.current) {', effect + '\n  useEffect(() => {\n     if (chatRef.current) {');

fs.writeFileSync('src/components/GameBoard.tsx', gameBoard);
