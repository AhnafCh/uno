import { Card, CardColor } from '../types.ts';

interface Props {
  card: Card;
  isCurrentColor?: CardColor;
}

const SkipIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="white" stroke="black" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M5.5 5.5L18.5 18.5" stroke="black" strokeWidth="3" />
    <path d="M5.5 5.5L18.5 18.5" stroke="white" strokeWidth="1.5" />
  </svg>
);

const SkipEveryoneIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 32 24" className={className} fill="white" stroke="black" strokeWidth="1.5">
    {/* Back circle */}
    <circle cx="10" cy="12" r="8" fill="white" stroke="black" strokeWidth="1.5" />
    <path d="M4.5 6.5L15.5 17.5" stroke="black" strokeWidth="2.5" />
    <path d="M4.5 6.5L15.5 17.5" stroke="white" strokeWidth="1.5" />
    
    {/* Front circle */}
    <circle cx="22" cy="12" r="8" fill="white" stroke="black" strokeWidth="1.5" />
    <path d="M16.5 6.5L27.5 17.5" stroke="black" strokeWidth="2.5" />
    <path d="M16.5 6.5L27.5 17.5" stroke="white" strokeWidth="1.5" />
  </svg>
);

const ReverseIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="white" strokeWidth="2" style={{ filter: 'drop-shadow(1px 1px 0px black) drop-shadow(-1px -1px 0px black)' }}>
    <path d="M7 10L3 14L7 18" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 14H17C18.6569 14 20 12.6569 20 11V9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 14L21 10L17 6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 10H7C5.34315 10 4 11.3431 4 13V15" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ColorRouletteIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} stroke="black" strokeWidth="1">
    <path d="M12 2L19 9L12 16L5 9L12 2Z" fill="#e53935" />
    <path d="M19 9L22 12L15 19L12 16L19 9Z" fill="#1e88e5" />
    <path d="M12 16L15 19L8 22L5 19L12 16Z" fill="#43a047" />
    <path d="M5 9L12 16L5 19L2 12L5 9Z" fill="#fdd835" />
  </svg>
);

export default function PlayingCard({ card, isCurrentColor }: Props) {
  const getBgColor = () => {
    const color = isCurrentColor || card.color;
    switch (color) {
      case 'red': return 'bg-[#e53935]';
      case 'blue': return 'bg-[#1e88e5]';
      case 'green': return 'bg-[#43a047]';
      case 'yellow': return 'bg-[#fdd835]';
      case 'wild': return 'bg-[#1a1a1a]';
      default: return 'bg-white';
    }
  };

  const displayValue = (isCenter: boolean) => {
    const className = isCenter ? "w-16 h-16 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]" : "w-6 h-6 drop-shadow-[1px_1px_0_rgba(0,0,0,1)]";
    switch (card.value) {
      case 'skip': return <SkipIcon className={className} />;
      case 'skip_everyone': return <SkipEveryoneIcon className={isCenter ? "w-20 h-16 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]" : "w-8 h-6 drop-shadow-[1px_1px_0_rgba(0,0,0,1)]"} />;
      case 'reverse': return <ReverseIcon className={className} />;
      case 'draw2': return '+2';
      case 'draw4': return '+4';
      case 'discard_all': return <div className="leading-none text-center"><span className="text-[0.6em] block">ALL</span></div>;
      case 'wild': return 'W';
      case 'wild_reverse_draw4': return <div className="flex flex-col items-center"><ReverseIcon className={isCenter ? "w-8 h-8 mb-1" : "w-4 h-4"}/>+4</div>;
      case 'wild_draw6': return '+6';
      case 'wild_draw10': return '+10';
      case 'wild_color_roulette': return <ColorRouletteIcon className={className} />;
      default: return card.value;
    }
  };

  const isWild = card.color === 'wild';
  const textStyle = { 
    textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 2px 2px 0 #000'
  };
    
  const centerTextStyle = { 
    textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 4px 4px 0 #000'
  };

  return (
    <div className={`w-32 h-48 rounded-xl shadow-xl border-[8px] border-[#1a1a1a] flex flex-col justify-between p-2 relative select-none overflow-hidden ${getBgColor()}`}>
      {/* Top Left */}
      <div className="relative text-2xl font-black text-white z-20 flex items-center justify-center w-8 h-8" style={textStyle}>
        {displayValue(false)}
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
          <div className="text-6xl font-black text-white z-10 transform rotate-[22deg] flex flex-col items-center justify-center" style={centerTextStyle}>
            {displayValue(true)}
          </div>
        </div>
      </div>

      {/* Bottom Right */}
      <div className="relative text-2xl font-black text-white z-20 rotate-180 flex items-center justify-center w-8 h-8 self-end" style={textStyle}>
        {displayValue(false)}
      </div>
    </div>
  );
}
