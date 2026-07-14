const fs = require('fs');
let code = fs.readFileSync('src/components/PlayingCard.tsx', 'utf-8');

code = code.replace(
  /style=\{typeof displayValue\(false\) === 'string' \? textStyle : \{\}\}/g,
  'style={textStyle}'
);
code = code.replace(
  /style=\{typeof displayValue\(true\) === 'string' \? centerTextStyle : \{\}\}/g,
  'style={centerTextStyle}'
);

fs.writeFileSync('src/components/PlayingCard.tsx', code);
