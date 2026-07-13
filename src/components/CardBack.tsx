import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CardBack({ className = '', size = 'md' }: Props) {
  const getContainerClass = () => {
    switch (size) {
      case 'sm': return 'w-12 h-16 rounded-md'; 
      case 'md': return 'w-24 h-36 rounded-lg'; 
      case 'lg': return 'w-32 h-48 rounded-xl'; 
    }
  };

  const borderWidth = size === 'sm' ? '2px' : size === 'md' ? '4px' : '6px';
  const logoWidth = size === 'sm' ? 'w-[120%]' : size === 'md' ? 'w-[120%]' : 'w-[120%]';
  const logoHeight = size === 'sm' ? 'h-[75%]' : size === 'md' ? 'h-[75%]' : 'h-[75%]';
  const logoBorder = size === 'sm' ? '2px' : size === 'md' ? '3px' : '4px';
  
  const textSizeUno = size === 'sm' ? 'text-[12px]' : size === 'md' ? 'text-2xl' : 'text-4xl';
  const textStrokeUno = size === 'sm' ? '0.5px black' : size === 'md' ? '1px black' : '2px black';
  const textShadowUno = size === 'sm' ? '1px 1px 0 #000' : size === 'md' ? '2px 2px 0 #000' : '3px 3px 0 #000';
  
  const textShowEm = size === 'sm' ? 'text-[4px]' : size === 'md' ? 'text-[8px]' : 'text-[10px]';
  const textNoMercy = size === 'sm' ? 'text-[5px]' : size === 'md' ? 'text-[10px]' : 'text-sm';
  const noMercyPadding = size === 'sm' ? 'px-[2px]' : size === 'md' ? 'px-1 py-[1px]' : 'px-2 py-[2px]';

  return (
    <div className={`${getContainerClass()} bg-[#c62828] shadow-md relative overflow-hidden flex flex-col items-center justify-center border-white ${className}`} style={{ borderWidth }}>
      
      {/* Radial Burst Background Effect */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
        style={{
          background: 'repeating-conic-gradient(from 0deg, transparent 0deg 15deg, #7f0000 15deg 30deg)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* Main UNO Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center transform -rotate-[22deg] mt-[-15%]">
        <div className={`${logoWidth} ${logoHeight} absolute rounded-[50%] border-yellow-400 bg-[#e53935] shadow-[2px_2px_0_rgba(0,0,0,0.8)]`} style={{ borderWidth: logoBorder }}></div>
        <span className={`relative z-10 font-black text-white ${textSizeUno} tracking-tighter`} style={{ WebkitTextStroke: textStrokeUno, textShadow: textShadowUno }}>
          UNO
        </span>
      </div>

      {/* NO MERCY branding */}
      <div className="relative z-10 mt-1 flex flex-col items-center transform -rotate-[22deg] ml-2">
        <div className={`font-bold text-white uppercase tracking-widest ${textShowEm} leading-none`} style={{ textShadow: '1px 1px 0 #000' }}>
          SHOW 'EM
        </div>
        <div className={`bg-black transform -skew-x-12 mt-[2px] shadow-lg border border-black/50 flex items-center justify-center ${noMercyPadding}`}>
          <div className={`font-black text-white italic tracking-tighter uppercase ${textNoMercy} leading-none`}>
            NO MERCY
          </div>
        </div>
      </div>
      
    </div>
  );
}
