const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

if (!code.includes('Maximize')) {
    code = code.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, Maximize, Minimize } from 'lucide-react';");
}

const fullscreenState = `  const [timeOffset, setTimeOffset] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };`;
code = code.replace(/const \[timeOffset, setTimeOffset\] = useState\(0\);/, fullscreenState);

const quitButton = `<button onClick={() => window.location.reload()} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded text-xs font-bold transition-all text-white">
            QUIT
          </button>`;
const buttons = `<button onClick={toggleFullscreen} className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded transition-all text-white" title="Toggle Fullscreen">
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          <button onClick={() => window.location.reload()} className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded text-xs font-bold transition-all text-white">
            QUIT
          </button>`;
code = code.replace(quitButton, buttons);

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Fixed fullscreen");
