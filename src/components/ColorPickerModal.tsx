import { motion, AnimatePresence } from 'motion/react';
import { CardColor } from '../types.ts';
import { getColorHex } from '../utils.ts';

interface Props {
  show: boolean;
  onColorChosen: (color: CardColor) => void;
}

export default function ColorPickerModal({ show, onColorChosen }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <motion.div 
             initial={{ scale: 0.8, opacity: 0, y: 20 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.8, opacity: 0, y: 20 }}
             transition={{ type: "spring", stiffness: 300, damping: 25 }}
             className="bg-[#0a0a0c] p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10"
          >
            <h3 className="text-2xl font-black mb-8 text-center uppercase tracking-widest text-white/90">Choose Color</h3>
            <div className="grid grid-cols-2 gap-6">
              {(['red', 'blue', 'green', 'yellow'] as CardColor[]).map((color, i) => (
                <motion.button
                  key={color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 5 : -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onColorChosen(color)}
                  className="w-24 h-24 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-4 border-[#1a1a1a] relative overflow-hidden group"
                  style={{ backgroundColor: getColorHex(color) }}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-2 border-2 border-white/20 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
