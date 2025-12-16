export enum GenerationStatus {
  IDLE = 'IDLE',
  OPTIMIZING = 'OPTIMIZING', // Analyzing text and creating a visual prompt
  GENERATING = 'GENERATING', // Actually generating the image
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeneratedResult {
  originalText: string;
  optimizedPrompt: string;
  imageDataUrl: string;
  timestamp: number;
}

export interface AppError {
  message: string;
  code?: string;
}