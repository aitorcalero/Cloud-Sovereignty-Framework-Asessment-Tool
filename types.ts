
export type Language = 'es' | 'en';

export enum SOV_ID {
  SOV1 = 'SOV-1',
  SOV2 = 'SOV-2',
  SOV3 = 'SOV-3',
  SOV4 = 'SOV-4',
  SOV5 = 'SOV-5',
  SOV6 = 'SOV-6',
  SOV7 = 'SOV-7',
  SOV8 = 'SOV-8'
}

export interface SovereigntyObjective {
  id: SOV_ID;
  name: string;
  weight: number;
  description: string;
  factors: string[];
}

export enum SEAL_LEVEL {
  SEAL0 = 0,
  SEAL1 = 1,
  SEAL2 = 2,
  SEAL3 = 3,
  SEAL4 = 4
}

export interface SEAL_Definition {
  level: SEAL_LEVEL;
  name: string;
  description: string;
}

export interface AssessmentState {
  scores: Record<SOV_ID, number>;
  notes: Record<SOV_ID, string>;
}
