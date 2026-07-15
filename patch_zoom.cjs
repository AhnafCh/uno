const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const stateHook = `  const [isFullscreen, setIsFullscreen] = useState(false);
  const [boardScale, setBoardScale] = useState(1);
  
  useEffect(() => {
    const handleResize = () => {
       if (window.innerHeight < 700) {
           setBoardScale(Math.max(0.4, window.innerHeight / 750));
       } else {
           setBoardScale(1);
       }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);`;

code = code.replace(/const \[isFullscreen, setIsFullscreen\] = useState\(false\);/, stateHook);

code = code.replace(/<div className="flex-1 flex flex-col relative bg-\[radial-gradient\(circle_at_center,_#1c1c24_0%,_#0a0a0c_80%\)\]">/g, '<div className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_center,_#1c1c24_0%,_#0a0a0c_80%)]" style={{ zoom: boardScale }}>');

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Fixed zoom");
