const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Remove static import
code = code.replace(/import \{ createServer as createViteServer \} from "vite";\n/, '');

// Replace usage with dynamic import
const search = `    const vite = await createViteServer({`;
const replace = `    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({`;
code = code.replace(search, replace);

fs.writeFileSync('server.ts', code);
console.log("Fixed server.ts");
