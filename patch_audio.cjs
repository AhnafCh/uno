const fs = require('fs');
let code = fs.readFileSync('src/useAudio.ts', 'utf-8');

const targetStr = `      case 'turn':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.15);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;`;

const replacementStr = `      case 'turn':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); // A4
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(880, now + 0.1); // A5
        gain2.gain.setValueAtTime(0.4, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.1);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.3);
        break;`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('src/useAudio.ts', code);
    console.log("Patched audio");
} else {
    console.log("Could not find insert point");
}
