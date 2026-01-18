
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Download, Info, Settings, SkipForward, SkipBack } from 'lucide-react';
import { COLORS, STAGES } from './constants';
import { FloorPlan } from './components/FloorPlan';
import { Pix2PixDiagram } from './components/Pix2PixDiagram';
import { SceneType } from './types';

import { PaperReader } from './components/PaperReader';
import { ZoomableImage } from './components/ZoomableImage';

export default function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflow' | 'paper'>('workflow');
  const animationRef = useRef<number>();

  // Derived states based on currentTime (0-77s)
  const currentScene: SceneType =
    currentTime < 8 ? SceneType.Architecture :
      currentTime < 16 ? SceneType.RawMaterial :
        currentTime < 24 ? SceneType.Framing :
          currentTime < 33 ? SceneType.Dataset :
            currentTime < 41 ? SceneType.GANArchitecture : // New step
              currentTime < 49.5 ? SceneType.Step1 : // +8s
                currentTime < 57 ? SceneType.Step2 : // +8s
                  currentTime < 65 ? SceneType.Evaluation : // +8s
                    currentTime < 71 ? SceneType.ValidationStep1 : // +8s
                      currentTime < 77 ? SceneType.ValidationStep2 : // +8s
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
        if (newTime >= 77) {
          setIsPlaying(false);
          return 77;
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
    if (currentTime >= 77) {
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };
  const prevStep = () => {
    // Logic: 
    // > 71 -> Val1 (71)
    // > 65 -> Eval (65)
    // > 57 -> Step2 (57)
    // > 49.5 -> Step1 (49.5)
    // > 41 -> GAN (41)
    // > 33 -> Dataset (33)
    // > 24 -> Framing (24)
    // > 16 -> RawMaterial (16)
    // > 8 -> Architecture (8)
    // > 0 -> Architecture (0)

    // Add a small buffer epsilon to allow double clicking to go back further
    const epsilon = 0.5;

    if (currentTime > 71 + epsilon) setCurrentTime(71);
    else if (currentTime > 65 + epsilon) setCurrentTime(65);
    else if (currentTime > 57 + epsilon) setCurrentTime(57);
    else if (currentTime > 49.5 + epsilon) setCurrentTime(49.5);
    else if (currentTime > 41 + epsilon) setCurrentTime(41);
    else if (currentTime > 33 + epsilon) setCurrentTime(33);
    else if (currentTime > 24 + epsilon) setCurrentTime(24);
    else if (currentTime > 16 + epsilon) setCurrentTime(16);
    else if (currentTime > 8 + epsilon) setCurrentTime(8);
    else setCurrentTime(0);
  };

  const nextStep = () => {
    if (currentTime < 8) setCurrentTime(8);
    else if (currentTime < 16) setCurrentTime(16);
    else if (currentTime < 24) setCurrentTime(24);
    else if (currentTime < 33) setCurrentTime(33);
    else if (currentTime < 41) setCurrentTime(41);
    else if (currentTime < 49.5) setCurrentTime(49.5);
    else if (currentTime < 57) setCurrentTime(57);
    else if (currentTime < 65) setCurrentTime(65);
    else if (currentTime < 71) setCurrentTime(71);
    else if (currentTime < 77) setCurrentTime(77);
    else setCurrentTime(0);
  };


  // Scene Components
  const renderScene = () => {
    switch (currentScene) {
      case SceneType.Architecture:
        return (
          <div className="flex flex-col items-center justify-center h-full px-2 md:px-12">
            <ZoomableImage className="rounded-lg shadow-lg w-full max-w-4xl aspect-video border bg-white">
              <img
                src="images/Figure 1.jpg"
                alt="System Architecture"
                className="w-full h-full object-contain"
              />
            </ZoomableImage>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 md:mt-12 text-center"
            >
              <h3 className="text-lg md:text-xl font-medium">Architecture</h3>
              <p className="text-gray-500 text-xs md:text-sm mt-2">Overall system workflow and components</p>
            </motion.div>
          </div>
        );

      case SceneType.RawMaterial:
        return (
          <div className="flex flex-col items-center justify-center h-full px-2 md:px-12">
            <ZoomableImage className="rounded-lg shadow-lg w-full max-w-4xl aspect-video border bg-white">
              <img
                src="images/Figure 6.jpg"
                alt="Raw Material - School Plans"
                className="w-full h-full object-contain"
              />
            </ZoomableImage>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 md:mt-12 text-center"
            >
              <h3 className="text-lg md:text-xl font-medium">Raw Material</h3>
              <p className="text-gray-500 text-xs md:text-sm mt-2">School plans used as input data</p>
            </motion.div>
          </div>
        );

      case SceneType.Framing:
        const visibleCount = currentTime < 3 ? 1 : currentTime < 6 ? 2 : 3;
        return (
          <div className="flex flex-row justify-center items-end gap-2 md:gap-12 h-full py-4 md:py-12">
            {STAGES.map((stage, idx) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: idx < visibleCount ? 1 : 0, y: idx < visibleCount ? 0 : 20 }}
                className="flex flex-col items-center gap-2 md:gap-4 w-24 md:w-56"
              >
                <span className="text-[10px] md:text-sm font-semibold text-gray-600">{stage.label}</span>
                <FloorPlan stage={stage.id as any} className="w-full border shadow-sm rounded-sm bg-white" />
                <div className="h-8 md:h-12 flex flex-col items-center">
                  {stage.caption && (
                    <span className="text-[8px] md:text-[10px] text-gray-400 mt-2 uppercase tracking-tighter">
                      {stage.caption}
                    </span>
                  )}
                  {idx < 2 && idx < visibleCount - 1 && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: window.innerWidth >= 768 ? 40 : 10 }}
                      className="h-px bg-gray-300 absolute mt-4 -right-4 md:-right-20"
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
          <div className="flex flex-col items-center justify-center h-full px-2 md:px-12">
            <div className="flex flex-row gap-4 md:gap-12 items-center">
              <motion.div
                animate={{ scale: showAugment ? 0.7 : 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <ZoomableImage className="rounded-lg shadow-lg border bg-white">
                  <FloorPlan stage={'footprint'} className="w-32 md:w-48" />
                </ZoomableImage>
              </motion.div>
              {showAugment && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.0 }}
                >
                  <ZoomableImage className="rounded-lg shadow-lg border bg-white">
                    <img
                      src="images/dataset.jpg"
                      alt="Dataset Augmentations"
                      className="w-48 md:w-80 object-cover"
                    />
                  </ZoomableImage>
                </motion.div>
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

      case SceneType.GANArchitecture:
        return (
          <div className="flex flex-col items-center justify-center h-full px-2 md:px-12">
            <ZoomableImage className="rounded-lg shadow-lg w-full max-w-4xl aspect-video border bg-white">
              <img
                src="images/Figure 4.JPG"
                alt="GAN Architecture"
                className="w-full h-full object-contain"
              />
            </ZoomableImage>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 md:mt-12 text-center"
            >
              <h3 className="text-lg md:text-xl font-medium">GAN Architecture</h3>
              <p className="text-gray-500 text-xs md:text-sm mt-2">Generative adversarial neural network architecture</p>
            </motion.div>
          </div>
        );

      case SceneType.Step1:
        // Ensure minimum visibility of 0.1 so the box isn't empty at start
        const s1ProgressRaw = (currentTime - 41) / 8.5;
        const s1Progress = Math.max(0.1, Math.min(1, s1ProgressRaw));
        const epochs1 = [10, 30, 70, 170];
        const currentEpochIdx1 = Math.floor(Math.min(1, Math.max(0, s1ProgressRaw)) * 4);
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
        // Ensure minimum visibility of 0.1
        const s2ProgressRaw = (currentTime - 49.5) / 7.5;
        const s2Progress = Math.max(0.1, Math.min(1, s2ProgressRaw));
        const epochs2 = [10, 70, 140, 210, 300];
        const currentEpochIdx2 = Math.floor(Math.min(1, Math.max(0, s2ProgressRaw)) * 5);
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
        // Fixed value of 0.88 (88) as per user request to show final result immediately
        const ssim = 0.88;
        return (
          <div className="flex flex-col items-center justify-center h-full px-2 md:px-24">
            <div className="flex flex-row gap-2 md:gap-16 items-center">
              <div className="flex flex-col items-center gap-4">
                <span className="text-[8px] md:text-xs font-bold text-gray-400">GENERATED</span>
                <div className="relative">
                  <FloorPlan stage={'generated_inaccurate' as any} className="w-24 md:w-48 border bg-white" />
                  <motion.div
                    className="absolute inset-0 bg-blue-500/10 pointer-events-none"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-8">
                <div className="w-16 h-16 md:w-32 md:h-32 rounded-full flex items-center justify-center relative">
                  <span className="text-sm md:text-3xl font-bold font-mono">{(ssim * 100).toFixed(0)}</span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                    {/* Background Track */}
                    <circle
                      cx="64" cy="64" r="60"
                      fill="none" stroke="#F3F4F6" strokeWidth="4"
                    />
                    {/* Progress Circle with Pulse Animation */}
                    <motion.circle
                      cx="64" cy="64" r="60"
                      fill="none" stroke="#3B82F6" strokeWidth="4"
                      strokeDasharray="377"
                      initial={{ strokeDashoffset: 377 }}
                      animate={{
                        strokeDashoffset: [
                          377 * (1 - ssim),
                          377 * (1 - ssim) - 10,
                          377 * (1 - ssim)
                        ]
                      }}
                      transition={{
                        strokeDashoffset: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        },
                        default: { duration: 0.5 } // Entry animation
                      }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute -bottom-6 text-[8px] md:text-[10px] font-bold text-gray-500">SSIM INDEX</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <span className="text-[8px] md:text-xs font-bold text-gray-400">TARGET</span>
                <FloorPlan stage="furnishing" className="w-24 md:w-48 border bg-gray-50" />
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
            <div className="flex flex-row items-center gap-2 md:gap-12">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-gray-400">VAL INPUT</span>
                <FloorPlan stage="val_footprint" className="w-20 md:w-48 border bg-white" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-8 md:w-12 h-[2px] bg-blue-500" />
                <span className="text-[8px] mt-1 text-blue-500 uppercase tracking-widest">Generative</span>
              </motion.div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-blue-500 font-bold">PREDICTION</span>
                <FloorPlan stage="val_zoning" className="w-20 md:w-48 border bg-white" />
              </div>
            </div>
            <p className="text-gray-500 text-xs md:text-sm mt-4 md:mt-12">Generating Zoning layout from Footprint.</p>
          </div>
        );

      case SceneType.ValidationStep2:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-base md:text-xl font-medium mb-4 md:mb-12">Validation: Step 2</h2>
            <div className="flex flex-row items-center gap-2 md:gap-12">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-gray-400">VAL INPUT</span>
                <FloorPlan stage="val_zoning" className="w-20 md:w-48 border bg-white" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-8 md:w-12 h-[2px] bg-blue-500" />
                <span className="text-[8px] mt-1 text-blue-500 uppercase tracking-widest">Refinement</span>
              </motion.div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-blue-500 font-bold">PREDICTION</span>
                <FloorPlan stage="val_furnishing" className="w-20 md:w-48 border bg-white" />
              </div>
            </div>
            <p className="text-gray-500 text-xs md:text-sm mt-4 md:mt-12">Populating Furniture and details.</p>
          </div>
        );

      case SceneType.Summary:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-row justify-center items-center gap-2 md:gap-12">
              <FloorPlan stage="footprint" className="w-16 md:w-32 border bg-white" />
              <motion.div initial={{ width: 0 }} animate={{ width: window.innerWidth >= 768 ? 40 : 10 }} className="h-px bg-black" />
              <FloorPlan stage="zoning" className="w-16 md:w-32 border bg-white" />
              <motion.div initial={{ width: 0 }} animate={{ width: window.innerWidth >= 768 ? 40 : 10 }} className="h-px bg-black" />
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
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-2 md:mb-4 gap-2 md:gap-0 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
            EDU-AI <span className="text-blue-500">Visualization</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 hidden md:block">Pix2Pix Two-Step Layout Generation Pipeline</p>
        </div>
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'workflow'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Workflow
          </button>
          <button
            onClick={() => setActiveTab('paper')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'paper'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Paper
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="canvas-container flex-1 shadow-2xl relative w-full overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'workflow' ? (
            <motion.div
              key="workflow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col"
            >
              <div className="w-full h-full overflow-y-auto md:overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentScene}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: (currentScene === SceneType.Step1 || currentScene === SceneType.Step2) ? 1.0 : 0.5 }}
                    className="w-full h-full"
                  >
                    {renderScene()}
                  </motion.div>
                </AnimatePresence>

                {/* Scene Labels Overlay - Only show in Workflow */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-1 pointer-events-none">
                  <span className="text-[8px] md:text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                    SCENE {Object.values(SceneType).indexOf(currentScene) + 1} / 11
                  </span>
                  <span className="text-xs md:text-sm font-medium text-gray-900 capitalize">
                    {currentScene.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              </div>

            </motion.div>
          ) : (
            <PaperReader />
          )}
        </AnimatePresence>
      </main>

      {/* Controls & Legend - Only show in Workflow */}
      {activeTab === 'workflow' && (
        <>
          <div className="w-full max-w-6xl mt-4 grid grid-cols-1 lg:grid-cols-4 gap-6 shrink-0">
            {/* Playback Controls */}
            <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
              <div className="flex items-center justify-center gap-6 mb-4">
                <button onClick={prevStep} className="p-2 text-gray-400 hover:text-blue-500 transition" title="Previous Step">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition shadow-lg shadow-blue-200"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </button>
                <button onClick={nextStep} className="p-2 text-gray-400 hover:text-blue-500 transition" title="Next Step">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>{Math.floor(currentTime)}s</span>
                  <span>77.0s</span>
                </div>
                <input
                  type="range"
                  min="0" max="77" step="0.1"
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
          <footer className="mt-4 text-gray-400 text-[10px] font-medium flex flex-wrap justify-center gap-4 md:gap-8 hidden md:flex shrink-0">
            <span>FRAME RATE: 24 FPS</span>
            <span>RESOLUTION: 1920 X 1080 (RENDER)</span>
            <span>ASPECT RATIO: 16:9</span>
            <span>ENGINE: PIX2PIX (U-NET)</span>
          </footer>
        </>
      )}
    </div>
  );
}
