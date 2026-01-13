import React from 'react';

interface FloorPlanProps {
  stage: 'footprint' | 'zoning' | 'furnishing' | 'raster' | 'val_footprint' | 'val_zoning' | 'val_furnishing' | 'generated_inaccurate' | 'augmentation';
  progress?: number;
  className?: string;
}

const STAGE_IMAGE_MAP = {
  footprint: { url: 'images/training/vf5_1%20copy.jpg', crop: 'left' },
  raster: { url: 'images/training/vf5_1%20copy.jpg', crop: 'left' },
  zoning: { url: 'images/training/vf5_1%20copy.jpg', crop: 'right' },
  furnishing: { url: 'images/training/vf5_2%20copy.jpg', crop: 'right' },
  val_footprint: { url: 'images/validation/vf6_1%20copy.jpg', crop: 'left' },
  val_zoning: { url: 'images/validation/vf6_1%20copy.jpg', crop: 'right' },
  val_furnishing: { url: 'images/validation/vf6_2%20copy.jpg', crop: 'right' },
  generated_inaccurate: { url: 'images/generated_not_accurate.png', crop: 'full' },
  augmentation: { url: 'images/scene_6-2.png', crop: 'full' },
};

export const FloorPlan: React.FC<FloorPlanProps> = ({ stage, progress = 1, className = "" }) => {
  const config = STAGE_IMAGE_MAP[stage];

  return (
    <div className={`relative ${className} overflow-hidden aspect-[1/1]`}>
      <div className="w-full h-full relative" style={{ opacity: progress }}>
        <img
          src={config.url}
          alt={stage}
          className="absolute w-[200%] h-full max-w-none"
          style={{
            left: config.crop === 'left' ? '0%' : config.crop === 'right' ? '-100%' : '0%',
            width: config.crop === 'full' ? '100%' : '200%',
            objectFit: 'cover',
            filter: stage === 'raster' ? 'blur(2px) contrast(150%) brightness(90%)' : 'none'
          }}
        />
      </div>
    </div>
  );
};
