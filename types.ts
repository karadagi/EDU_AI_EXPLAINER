
export enum SceneType {
  Framing = 'framing',
  Dataset = 'dataset',
  Step1 = 'step1',
  Step2 = 'step2',
  Evaluation = 'evaluation',
  ValidationStep1 = 'validationStep1',
  ValidationStep2 = 'validationStep2',
  Summary = 'summary'
}

export interface ColorLegend {
  label: string;
  color: string;
  hex: string;
}

export interface FloorPlanStage {
  id: 'footprint' | 'zoning' | 'furnishing';
  label: string;
  caption: string;
}
