
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, Cpu } from 'lucide-react';

interface DiagramProps {
  inputLabel: string;
  outputLabel: string;
  progress: number;
  epoch: number;
}

export const Pix2PixDiagram: React.FC<DiagramProps> = ({ inputLabel, outputLabel, progress, epoch }) => {
  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 w-full max-w-4xl px-2 md:px-4">
      <div className="flex items-center justify-between w-full gap-2 md:gap-0">
        {/* Input */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-lg border flex items-center justify-center">
            <Database className="w-4 h-4 md:w-6 md:h-6 text-gray-400" />
          </div>
          <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider text-gray-500 text-center">{inputLabel}</span>
        </div>



        <div className="flex-1 h-px bg-gray-200 mx-2 md:mx-4 relative">
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full blur-sm"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Generator */}
        <div className="relative">
          <div className="w-20 h-16 md:w-32 md:h-24 bg-white border-2 border-blue-500 rounded-xl flex flex-col items-center justify-center z-10 relative">
            <Cpu className="w-4 h-4 md:w-6 md:h-6 text-blue-500 mb-1" />
            <span className="text-[8px] md:text-[10px] font-bold text-blue-600">GENERATOR</span>
            <span className="text-[7px] md:text-[9px] text-gray-400">Encoder-Decoder</span>
          </div>
          {/* Discriminator Overlay */}
          <motion.div
            className="absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 w-16 h-12 md:w-24 md:h-16 bg-white border border-red-200 rounded-lg flex flex-col items-center justify-center shadow-sm"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-[6px] md:text-[8px] font-bold text-red-400">DISCRIMINATOR</span>
            <div className="w-10 md:w-16 h-1 bg-gray-100 mt-1 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-400"
                animate={{ width: [`${progress * 100}%`, `${(progress + 0.1) * 90}%`] }}
                transition={{ duration: 0.25, repeat: Infinity, repeatType: "reverse" }}
              />
            </div>
            <span className="text-[8px] text-gray-400 mt-1">Real / Fake</span>
          </motion.div>
        </div>

        <div className="flex-1 h-px bg-gray-200 mx-2 md:mx-4 relative">
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full blur-sm"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-lg border flex items-center justify-center">
            <Activity className="w-4 h-4 md:w-6 md:h-6 text-blue-500" />
          </div>
          <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider text-blue-500 text-center">{outputLabel}</span>
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-12 text-[10px] md:text-[11px] font-mono text-gray-500">
        <div className="flex flex-col">
          <span>EPOCH:</span>
          <span className="text-lg font-bold text-black">{epoch}</span>
        </div>
        <div className="flex flex-col">
          <span>LOSS (G):</span>
          <span className="text-lg font-bold text-blue-600">{(1 - progress).toFixed(4)}</span>
        </div>
        <div className="flex flex-col">
          <span>LOSS (D):</span>
          <span className="text-lg font-bold text-red-500">{(progress * 0.5).toFixed(4)}</span>
        </div>
      </div>
    </div >
  );
};
