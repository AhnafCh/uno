const fs = require('fs');
let code = fs.readFileSync('src/server/game.ts', 'utf-8');

const emojis = ['👽', '👻', '🤖', '👾', '🤠', '🤡', '👹', '👺', '😺', '💩'];
let i = 0;
code = code.replace(/<text[^>]*>.*?<\/text>/g, (match) => {
    if (i < emojis.length && match.includes('')) {
        const res = match.replace('', emojis[i]);
        i++;
        return res;
    }
    return match;
});

fs.writeFileSync('src/server/game.ts', code);
console.log("Fixed avatars");
