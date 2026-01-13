
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Download, Info, Settings } from 'lucide-react';
import { COLORS, STAGES } from './constants';
import { FloorPlan } from './components/FloorPlan';
import { Pix2PixDiagram } from './components/Pix2PixDiagram';
import { SceneType } from './types';

export default function App() {
  const [currentTime, setCurrentTime] = useState(53);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>();

  // Derived states based on currentTime (0-53s)
  const currentScene: SceneType =
    currentTime < 8 ? SceneType.Framing :
      currentTime < 17 ? SceneType.Dataset : // +3s duration (was 14)
        currentTime < 25.5 ? SceneType.Step1 : // +3s
          currentTime < 33 ? SceneType.Step2 : // +3s
            currentTime < 41 ? SceneType.Evaluation : // +3s
              currentTime < 47 ? SceneType.ValidationStep1 : // +3s
                currentTime < 53 ? SceneType.ValidationStep2 : // +3s
                  SceneType.Summary;

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (!isPlaying) return;
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      setCurrentTime((prevTime) => {
        const newTime = prevTime + deltaTime * 2.0; // Playback speed 2.0
        if (newTime >= 53) {
          setIsPlaying(false);
          return 53;
        }
        return newTime;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  const togglePlay = () => {
    if (currentTime >= 53) {
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };
  const reset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };


  // Scene Components
  const renderScene = () => {
    switch (currentScene) {
      case SceneType.Framing:
        const visibleCount = currentTime < 3 ? 1 : currentTime < 6 ? 2 : 3;
        return (
          <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-6 md:gap-12 h-full py-4 md:py-12">
            {STAGES.map((stage, idx) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: idx < visibleCount ? 1 : 0, y: idx < visibleCount ? 0 : 20 }}
                className="flex flex-col items-center gap-2 md:gap-4 w-32 md:w-56"
              >
                <span className="text-sm font-semibold text-gray-600">{stage.label}</span>
                <FloorPlan stage={stage.id as any} className="w-full border shadow-sm rounded-sm bg-white" />
                <div className="h-8 md:h-12 flex flex-col items-center">
                  {stage.caption && (
                    <span className="text-[10px] text-gray-400 mt-2 uppercase tracking-tighter">
                      {stage.caption}
                    </span>
                  )}
                  {idx < 2 && idx < visibleCount - 1 && (
                    <motion.div
                      initial={{ width: 0, height: 0 }}
                      animate={{
                        width: window.innerWidth >= 768 ? 40 : 0,
                        height: window.innerWidth < 768 ? 20 : 0
                      }}
                      className="hidden md:block h-px bg-gray-300 absolute mt-4 -right-20"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case SceneType.Dataset:
        const showAugment = currentTime > 10;
        return (
          <div className="flex flex-col items-center justify-center h-full px-4 md:px-12">
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-center">
              <motion.div
                animate={{ scale: showAugment ? 0.7 : 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <FloorPlan stage={'footprint'} className="w-32 md:w-48 border bg-white" />
              </motion.div>
              {showAugment && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.0, delay: i * 0.2 }}
                    >
                      <FloorPlan stage={'augmentation' as any} className="w-12 md:w-16 border bg-white" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 md:mt-12 text-center"
            >
              <h3 className="text-lg md:text-xl font-medium">Dataset Creation</h3>
              <p className="text-gray-500 text-xs md:text-sm mt-2">AutoCAD drawings → raster images; augmentation: rotation/mirror</p>
            </motion.div>
          </div>
        );

      case SceneType.Step1:
        const s1Progress = Math.min(1, (currentTime - 14) / 8.5);
        const epochs1 = [10, 30, 70, 170];
        const currentEpochIdx1 = Math.floor(s1Progress * 4);
        return (
          <div className="flex flex-col items-center justify-center h-full pt-8 md:pt-0">
            <Pix2PixDiagram
              inputLabel="Footprint"
              outputLabel="Generated Zoning"
              progress={s1Progress}
              epoch={epochs1[Math.min(3, currentEpochIdx1)]}
            />
            <div className="mt-6 md:mt-12 flex items-center gap-4 md:gap-12">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-gray-400">INPUT</span>
                <FloorPlan stage="footprint" className="w-20 md:w-24 border bg-white" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-blue-500 font-bold">PREDICTION</span>
                <FloorPlan stage="zoning" progress={s1Progress} className="w-20 md:w-24 border bg-white" />
              </div>
            </div>
          </div>
        );

      case SceneType.Step2:
        const s2Progress = Math.min(1, (currentTime - 22.5) / 7.5);
        const epochs2 = [10, 70, 140, 210, 300];
        const currentEpochIdx2 = Math.floor(s2Progress * 5);
        return (
          <div className="flex flex-col items-center justify-center h-full pt-8 md:pt-0">
            <Pix2PixDiagram
              inputLabel="Zoning"
              outputLabel="Generated Furnishing"
              progress={s2Progress}
              epoch={epochs2[Math.min(4, currentEpochIdx2)]}
            />
            <div className="mt-6 md:mt-12 flex items-center gap-4 md:gap-12">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-gray-400">INPUT</span>
                <FloorPlan stage="zoning" className="w-20 md:w-24 border bg-white" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-blue-500 font-bold">PREDICTION</span>
                <FloorPlan stage="furnishing" progress={s2Progress} className="w-20 md:w-24 border bg-white" />
              </div>
            </div>
          </div>
        );

      case SceneType.Evaluation:
        const ssim = Math.min(0.92, (currentTime - 33) / 8);
        return (
          <div className="flex flex-col items-center justify-center h-full px-4 md:px-24">
            <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-center">
              <div className="flex flex-col items-center gap-4">
                <span className="text-xs font-bold text-gray-400">GENERATED</span>
                <div className="relative">
                  <FloorPlan stage={'generated_inaccurate' as any} className="w-32 md:w-48 border bg-white" />
                  <motion.div
                    className="absolute inset-0 bg-blue-500/10 pointer-events-none"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-8">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center relative">
                  <span className="text-xl md:text-3xl font-bold font-mono">{ssim.toFixed(2)}</span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                    {/* Background Track */}
                    <circle
                      cx="64" cy="64" r="60"
                      fill="none" stroke="#F3F4F6" strokeWidth="4"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="64" cy="64" r="60"
                      fill="none" stroke="#3B82F6" strokeWidth="4"
                      strokeDasharray="377"
                      strokeDashoffset={377 * (1 - ssim)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute -bottom-6 text-[8px] md:text-[10px] font-bold text-gray-500">SSIM INDEX</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <span className="text-xs font-bold text-gray-400">GROUND TRUTH (TARGET)</span>
                <FloorPlan stage="furnishing" className="w-32 md:w-48 border bg-gray-50" />
              </div>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 md:mt-16 text-center">
              <h2 className="text-lg md:text-xl font-medium">Objective Evaluation</h2>
              <p className="text-gray-500 text-xs md:text-sm mt-1">High structural similarity (SSIM) indicates preservation of architectural constraints.</p>
            </motion.div>
          </div>
        );

      case SceneType.ValidationStep1:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-base md:text-xl font-medium mb-4 md:mb-12">Validation: Step 1</h2>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-gray-400">VAL INPUT</span>
                <FloorPlan stage="val_footprint" className="w-24 md:w-48 border bg-white" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center transform rotate-90 md:rotate-0"
              >
                <div className="w-8 md:w-12 h-[2px] bg-blue-500" />
                <span className="text-[8px] mt-1 text-blue-500 uppercase tracking-widest">Generative</span>
              </motion.div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-blue-500 font-bold">PREDICTION</span>
                <FloorPlan stage="val_zoning" className="w-24 md:w-48 border bg-white" />
              </div>
            </div>
            <p className="text-gray-500 text-xs md:text-sm mt-4 md:mt-12">Generating Zoning layout from Footprint.</p>
          </div>
        );

      case SceneType.ValidationStep2:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-base md:text-xl font-medium mb-4 md:mb-12">Validation: Step 2</h2>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-gray-400">VAL INPUT</span>
                <FloorPlan stage="val_zoning" className="w-24 md:w-48 border bg-white" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center transform rotate-90 md:rotate-0"
              >
                <div className="w-8 md:w-12 h-[2px] bg-blue-500" />
                <span className="text-[8px] mt-1 text-blue-500 uppercase tracking-widest">Refinement</span>
              </motion.div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-blue-500 font-bold">PREDICTION</span>
                <FloorPlan stage="val_furnishing" className="w-24 md:w-48 border bg-white" />
              </div>
            </div>
            <p className="text-gray-500 text-xs md:text-sm mt-4 md:mt-12">Populating Furniture and details.</p>
          </div>
        );

      case SceneType.Summary:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-2 md:gap-12">
              <FloorPlan stage="footprint" className="w-16 md:w-32 border bg-white" />
              <motion.div initial={{ width: 0 }} animate={{ width: 40 }} className="hidden md:block h-px bg-black" />
              <FloorPlan stage="zoning" className="w-16 md:w-32 border bg-white" />
              <motion.div initial={{ width: 0 }} animate={{ width: 40 }} className="hidden md:block h-px bg-black" />
              <FloorPlan stage="furnishing" className="w-16 md:w-32 border bg-white" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 md:mt-16 text-center"
            >
              <h1 className="text-xl md:text-3xl font-semibold tracking-tight">EDU-AI Workflow</h1>
              <p className="text-xs md:text-lg text-gray-500 mt-2">Twofold Pix2Pix workflow for classroom layout generation.</p>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] bg-neutral-50 flex flex-col items-center p-2 md:p-4 overflow-hidden">
      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-2 md:mb-4 gap-2 md:gap-0">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
            EDU-AI <span className="text-blue-500">Visualization</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 hidden md:block">Pix2Pix Two-Step Layout Generation Pipeline</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.open('https://doi.org/10.1108/IJBPA-09-2023-0130', '_blank')}
            className="p-2 text-gray-400 hover:text-black transition"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="canvas-container flex-1 shadow-2xl relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: (currentScene === SceneType.Step1 || currentScene === SceneType.Step2) ? 1.0 : 0.5 }}
            className="w-full h-full overflow-y-auto md:overflow-hidden"
          >
            {renderScene()}
          </motion.div>
        </AnimatePresence>

        {/* Scene Labels Overlay */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-1 pointer-events-none">
          <span className="text-[8px] md:text-[10px] font-bold text-blue-500 uppercase tracking-widest">
            SCENE {Object.values(SceneType).indexOf(currentScene) + 1} / 8
          </span>
          <span className="text-xs md:text-sm font-medium text-gray-900 capitalize">
            {currentScene.replace(/([A-Z])/g, ' $1').trim()}
          </span>
        </div>
      </main>

      {/* Controls & Legend */}
      <div className="w-full max-w-6xl mt-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Playback Controls */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            <button onClick={reset} className="p-2 text-gray-400 hover:text-blue-500 transition">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition shadow-lg shadow-blue-200"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-500 transition">
              <Download className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-bold text-gray-400">
              <span>{Math.floor(currentTime)}s</span>
              <span>53.0s</span>
            </div>
            <input
              type="range"
              min="0" max="53" step="0.1"
              value={currentTime}
              onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        {/* Color Legend */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <h4 className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest">Color Legend Mapping</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COLORS.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-sm border ${item.color}`} />
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="mt-4 text-gray-400 text-[10px] font-medium flex flex-wrap justify-center gap-4 md:gap-8 hidden md:flex">
        <span>FRAME RATE: 24 FPS</span>
        <span>RESOLUTION: 1920 X 1080 (RENDER)</span>
        <span>ASPECT RATIO: 16:9</span>
        <span>ENGINE: PIX2PIX (U-NET)</span>
      </footer>
    </div>
  );
}
