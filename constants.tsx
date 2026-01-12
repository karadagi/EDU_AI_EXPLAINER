
import { ColorLegend, FloorPlanStage } from './types';

export const COLORS: ColorLegend[] = [
  { label: 'Wall', color: 'bg-black', hex: '#000000' },
  { label: 'Door', color: 'bg-red-600', hex: '#FF0000' },
  { label: 'Opening', color: 'bg-cyan-400', hex: '#00FFFF' },
  { label: 'Footprint', color: 'bg-gray-200', hex: '#DCDCDC' },
  { label: 'Student Desks', color: 'bg-green-500', hex: '#00FF00' },
  { label: 'Teacher Desk', color: 'bg-fuchsia-500', hex: '#FF00FF' },
  { label: 'Board', color: 'bg-yellow-400', hex: '#FFFF00' },
  { label: 'Lockers', color: 'bg-orange-500', hex: '#FFA500' },
];

export const STAGES: FloorPlanStage[] = [
  { id: 'footprint', label: '(a) Footprint', caption: 'dataset 1' },
  { id: 'zoning', label: '(b) Zoning', caption: 'dataset 2' },
  { id: 'furnishing', label: '(c) Furnishing', caption: '' },
];
