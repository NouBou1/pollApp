export const SURVEY_CATEGORIES = [
  'Team Activities',
  'Health & Wellness',
  'Gaming & Entertainment',
  'Education & Learning',
  'Lifestyle & Preferences',
  'Technology & Innovation',
] as const;

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

export interface CreateSurveyPayload {
  title: string;
  description?: string | null;
  category: string;
  endsAt?: string | null;
  questions: {
    text: string;
    allowMultiple?: boolean;
    options: { text: string }[];
  }[];
}

export interface SubmitResponsePayload {
  answers: { questionId: string; optionId: string }[];
}
