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
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.8, opacity: 0 }}
             className="bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-white/10"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Choose Color</h3>
            <div className="grid grid-cols-2 gap-4">
              {(['red', 'blue', 'green', 'yellow'] as CardColor[]).map(color => (
                <button
                  key={color}
                  onClick={() => onColorChosen(color)}
                  className="w-24 h-24 rounded-xl shadow-lg transition-transform hover:scale-110 active:scale-95"
                  style={{ backgroundColor: getColorHex(color) }}
                ></button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
