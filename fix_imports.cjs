const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf8');

code = code.replace(/import \{ motion, AnimatePresence \} from 'motion\/react';\n/g, "");
code = "import { motion, AnimatePresence } from 'motion/react';\n" + code;

fs.writeFileSync('src/components/GameBoard.tsx', code);
