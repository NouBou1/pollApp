import { z } from 'zod';

export const createSurveySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).nullable().optional(),
  category: z.string().min(1).max(80),
  endsAt: z.string().datetime().nullable().optional(),
  questions: z
    .array(
      z.object({
        text: z.string().min(1).max(300),
        allowMultiple: z.boolean().optional(),
        options: z.array(z.object({ text: z.string().min(1).max(200) })).min(2).max(6),
      }),
    )
    .min(1),
});
export type CreateSurveyPayload = z.infer<typeof createSurveySchema>;

export const submitResponseSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        optionId: z.string().uuid(),
      }),
    )
    .min(1),
});
export type SubmitResponsePayload = z.infer<typeof submitResponseSchema>;

export interface SurveyListItem {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  endsAt: string | null;
  questionCount: number;
}

export interface SurveyOption {
  id: string;
  text: string;
  position: number;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  position: number;
  allowMultiple: boolean;
  options: SurveyOption[];
}

export interface SurveyDetail {
  id: string;
  title: string;
  description: string | null;
  category: string;
  createdAt: string;
  endsAt: string | null;
  questions: SurveyQuestion[];
}

export interface SurveyResults {
  surveyId: string;
  responseCount: number;
  questions: {
    questionId: string;
    options: { optionId: string; votes: number; percentage: number }[];
  }[];
}
