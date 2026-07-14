const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const targetLobbyRegex = /<span className="font-medium flex items-center gap-2">\s*<span className=\{\`w-3 h-3 rounded-full \$\{p\.connected \? 'bg-green-500' : 'bg-neutral-500'\}\`\}><\/span>\s*\{p\.name\} \{p\.id === socketId && "\(You\)"\} \{p\.isBot && <span className="text-\[10px\] bg-purple-500\/20 text-purple-400 px-2 py-0\.5 rounded uppercase font-bold">Bot<\/span>\}\s*<\/span>/;
const replacementLobby = `<span className="font-medium flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                        {p.avatar ? <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-xs">{p.name.substring(0, 2).toUpperCase()}</span>}
                        <span className={\`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#121214] \${p.connected ? 'bg-green-500' : 'bg-neutral-500'}\`}></span>
                    </div>
                    {p.name} {p.id === socketId && <span className="text-white/40 text-xs italic">(You)</span>} {p.isBot && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded uppercase font-bold">Bot</span>}
                  </span>`;

if (code.match(targetLobbyRegex)) {
    console.log("Found lobby player block");
    code = code.replace(targetLobbyRegex, replacementLobby);
} else {
    console.log("Could not find lobby player block");
}

fs.writeFileSync('src/components/GameBoard.tsx', code);
