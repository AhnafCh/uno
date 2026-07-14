const fs = require('fs');
let code = fs.readFileSync('src/useAudio.ts', 'utf-8');

const turnStart = "case 'turn':";
const nextCase = "case 'play':"; // wait, the order in switch?

// Let's just do a manual replace of the whole turn block
code = code.replace(/case 'turn':[\s\S]*?break;/g, `case 'turn':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.05); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.1); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.15); // C6
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;`);

fs.writeFileSync('src/useAudio.ts', code);
console.log("Patched turn audio to an arpeggio");
