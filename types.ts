
export enum SceneType {
  Framing = 'framing',
  Dataset = 'dataset',
  Step1 = 'step1',
  Step2 = 'step2',
  Evaluation = 'evaluation',
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
