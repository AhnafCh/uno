const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

if (!code.includes('Shuffle,')) {
    code = code.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, Shuffle } from 'lucide-react';");
}

code = code.replace('🔀 Shuffle Seats', '<Shuffle size={18} className="inline mr-2" /> Shuffle Seats');

fs.writeFileSync('src/components/GameBoard.tsx', code);
console.log("Fixed shuffle icon");
