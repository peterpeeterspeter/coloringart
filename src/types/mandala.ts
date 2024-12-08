export type MandalaAnswer = string | string[];

export interface MandalaAnswers {
  [key: string]: MandalaAnswer;
}

export interface MandalaFormData {
  name: string;
  description: string;
  answers: MandalaAnswers;
}