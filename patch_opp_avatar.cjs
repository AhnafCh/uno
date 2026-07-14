const fs = require('fs');
let code = fs.readFileSync('src/components/GameBoard.tsx', 'utf-8');

const targetOpponentRegex = /\{\/\* Avatar \*\/\}\s*<div className=\{(.*?)\}>\s*<span>\{p\.name\.substring\(0, 2\)\.toUpperCase\(\)\}<\/span>\s*<\/div>/;
const replacementOpponent = `{/* Avatar */}
                  <div className={$1}>
                    {p.avatar ? (
                        <img src={p.avatar} alt={p.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span>{p.name.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>`;

if (code.match(targetOpponentRegex)) {
    console.log("Found opponent avatar block");
    code = code.replace(targetOpponentRegex, replacementOpponent);
} else {
    console.log("Could not find opponent avatar block");
}

fs.writeFileSync('src/components/GameBoard.tsx', code);
