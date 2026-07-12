import { Card, CardColor } from '../types.ts';

interface Props {
  card: Card;
  isCurrentColor?: CardColor;
}

export default function PlayingCard({ card, isCurrentColor }: Props) {
  const getBgColor = () => {
    const color = isCurrentColor || card.color;
    switch (color) {
      case 'red': return 'bg-red-600';
      case 'blue': return 'bg-blue-600';
      case 'green': return 'bg-green-600';
      case 'yellow': return 'bg-yellow-500';
      case 'wild': return 'bg-neutral-900';
      default: return 'bg-white';
    }
  };

  const displayValue = () => {
    switch (card.value) {
      case 'skip': return '⊘';
      case 'reverse': return '⇄';
      case 'draw2': return '+2';
      case 'draw4': return '+4';
      case 'wild': return 'W';
      default: return card.value;
    }
  };

  const isWild = card.color === 'wild';

  return (
    <div className={`w-32 h-48 rounded-xl shadow-xl border-[6px] border-white flex flex-col justify-between p-2 relative select-none ${getBgColor()}`}>
      {/* Top Left */}
      <div className={`text-xl font-bold text-white drop-shadow-md ${isWild ? 'text-transparent bg-clip-text bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500' : ''}`}>
        {displayValue()}
      </div>

      {/* Center Oval/Shape */}
      <div className="absolute inset-4 bg-white/20 rounded-full flex items-center justify-center transform -rotate-12 overflow-hidden shadow-inner">
         {isWild && (
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-80">
               <div className="bg-red-500"></div>
               <div className="bg-blue-500"></div>
               <div className="bg-yellow-500"></div>
               <div className="bg-green-500"></div>
            </div>
         )}
        <span className="text-6xl font-black text-white drop-shadow-xl z-10" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
          {displayValue()}
        </span>
      </div>

      {/* Bottom Right */}
      <div className={`text-xl font-bold text-white drop-shadow-md rotate-180 text-left ${isWild ? 'text-transparent bg-clip-text bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500' : ''}`}>
        {displayValue()}
      </div>
    </div>
  );
}
