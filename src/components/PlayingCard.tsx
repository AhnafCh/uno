import { Card, CardColor } from '../types.ts';

interface Props {
  card: Card;
  isCurrentColor?: CardColor;
}

export default function PlayingCard({ card, isCurrentColor }: Props) {
  const getBgColor = () => {
    const color = isCurrentColor || card.color;
    switch (color) {
      case 'red': return 'bg-[#e53935]'; // slightly punchier red
      case 'blue': return 'bg-[#1e88e5]';
      case 'green': return 'bg-[#43a047]';
      case 'yellow': return 'bg-[#fdd835]';
      case 'wild': return 'bg-[#1a1a1a]';
      default: return 'bg-white';
    }
  };

  const displayValue = () => {
    switch (card.value) {
      case 'skip': return '⊘';
      case 'reverse': return '⇄';
      case 'draw2': return '+2';
      case 'draw4': return '+4';
      case 'discard_all': return 'ALL';
      case 'skip_everyone': return '⏭';
      case 'wild': return 'W';
      case 'wild_reverse_draw4': return '⇄+4';
      case 'wild_draw6': return '+6';
      case 'wild_draw10': return '+10';
      case 'wild_color_roulette': return '🎨';
      default: return card.value;
    }
  };

  const isWild = card.color === 'wild';

  const textStyle = { 
    WebkitTextStroke: '1px black',
    textShadow: '1px 1px 0 #000'
  };
  
  const centerTextStyle = { 
    WebkitTextStroke: '2px black',
    textShadow: '3px 3px 0 #000'
  };

  return (
    <div className={`w-32 h-48 rounded-xl shadow-xl border-[8px] border-[#1a1a1a] flex flex-col justify-between p-2 relative select-none overflow-hidden ${getBgColor()}`}>
      {/* Top Left */}
      <div className="text-2xl font-black text-white z-20" style={textStyle}>
        {displayValue()}
      </div>

      {/* Center Tilted Oval */}
      <div className="absolute top-2 bottom-2 left-1 right-1 flex items-center justify-center pointer-events-none">
        <div className={`w-[140%] h-[85%] rounded-[50%] border-[5px] border-[#1a1a1a] flex items-center justify-center transform -rotate-[22deg] overflow-hidden ${isWild ? 'bg-[#1a1a1a]' : getBgColor()}`}>
           {isWild && (
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 w-full h-full">
                 <div className="bg-[#e53935]"></div>
                 <div className="bg-[#1e88e5]"></div>
                 <div className="bg-[#fdd835]"></div>
                 <div className="bg-[#43a047]"></div>
              </div>
           )}
          <span className="text-6xl font-black text-white z-10 transform rotate-[22deg]" style={centerTextStyle}>
            {displayValue()}
          </span>
        </div>
      </div>

      {/* Bottom Right */}
      <div className="text-2xl font-black text-white z-20 rotate-180 flex justify-end" style={textStyle}>
        {displayValue()}
      </div>
    </div>
  );
}
