import { PostgrestClient } from '@supabase/postgrest-js';
import { environment } from '../../../environments/environment';
import {
  CreateSurveyPayload,
  SubmitResponsePayload,
  SurveyDetail,
  SurveyListItem,
  SurveyOption,
  SurveyQuestion,
  SurveyResults,
} from '../models/survey.model';

type QuestionPayload = CreateSurveyPayload['questions'][number];
type AnswerPayload = SubmitResponsePayload['answers'][number];
type OptionResult = SurveyResults['questions'][number]['options'][number];

interface SurveyListRow {
  id: string;
  title: string;
  category: string;
  created_at: string;
  ends_at: string | null;
  questions: { count: number }[];
}

interface QuestionRow {
  id: string;
  text: string;
  position: number;
  allow_multiple: boolean;
  options: SurveyOption[] | null;
}

const supabase = new PostgrestClient(`${environment.supabaseUrl}/rest/v1`, {
  headers: { apikey: environment.supabasePublishableKey },
});

// List

export async function listSurveys(): Promise<SurveyListItem[]> {
  const { data, error } = await supabase
    .from('surveys')
    .select('id, title, category, created_at, ends_at, questions(count)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => toListItem(row as SurveyListRow));
}

function toListItem(row: SurveyListRow): SurveyListItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    createdAt: row.created_at,
    endsAt: row.ends_at,
    questionCount: row.questions[0]?.count ?? 0,
  };
}

// Detail

export async function getSurvey(surveyId: string): Promise<SurveyDetail> {
  const survey = await fetchSurveyRow(surveyId);
  const questions = await fetchQuestions(surveyId);
  return {
    id: survey.id,
    title: survey.title,
    description: survey.description,
    category: survey.category,
    createdAt: survey.created_at,
    endsAt: survey.ends_at,
    questions,
  };
}

async function fetchSurveyRow(surveyId: string) {
  const { data, error } = await supabase
    .from('surveys')
    .select('id, title, description, category, created_at, ends_at')
    .eq('id', surveyId)
    .single();
  if (error) throw error;
  return data;
}

async function fetchQuestions(surveyId: string): Promise<SurveyQuestion[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('id, text, position, allow_multiple, options(id, text, position)')
    .eq('survey_id', surveyId)
    .order('position', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => toQuestion(row as QuestionRow));
}

function toQuestion(row: QuestionRow): SurveyQuestion {
  return {
    id: row.id,
    text: row.text,
    position: row.position,
    allowMultiple: row.allow_multiple,
    options: [...(row.options ?? [])].sort((a, b) => a.position - b.position),
  };
}

// Create

export async function createSurvey(payload: CreateSurveyPayload): Promise<{ id: string }> {
  const surveyId = await insertSurvey(payload);
  for (const [position, question] of payload.questions.entries()) {
    await insertQuestion(surveyId, question, position);
  }
  return { id: surveyId };
}

async function insertSurvey(payload: CreateSurveyPayload): Promise<string> {
  const { data, error } = await supabase
    .from('surveys')
    .insert({
      title: payload.title,
      description: payload.description ?? null,
      category: payload.category,
      ends_at: payload.endsAt ?? null,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

async function insertQuestion(surveyId: string, question: QuestionPayload, position: number) {
  const { data, error } = await supabase
    .from('questions')
    .insert({
      survey_id: surveyId,
      text: question.text,
      position,
      allow_multiple: question.allowMultiple ?? false,
    })
    .select('id')
    .single();
  if (error) throw error;
  await insertOptions(data.id as string, question.options);
}

async function insertOptions(questionId: string, options: QuestionPayload['options']) {
  const rows = options.map((option, position) => ({
    question_id: questionId,
    text: option.text,
    position,
  }));
  const { error } = await supabase.from('options').insert(rows);
  if (error) throw error;
}

// Responses

export async function submitResponse(surveyId: string, payload: SubmitResponsePayload) {
  const responseId = await insertResponse(surveyId);
  await insertAnswers(responseId, payload.answers);
}

async function insertResponse(surveyId: string): Promise<string> {
  const { data, error } = await supabase
    .from('responses')
    .insert({ survey_id: surveyId })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

async function insertAnswers(responseId: string, answers: AnswerPayload[]) {
  const rows = answers.map((answer) => ({
    response_id: responseId,
    question_id: answer.questionId,
    option_id: answer.optionId,
  }));
  const { error } = await supabase.from('response_answers').insert(rows);
  if (error) throw error;
}

// Results

export async function getResults(surveyId: string): Promise<SurveyResults> {
  const survey = await getSurvey(surveyId);
  const total = await countResponses(surveyId);
  const votes = await countVotesByOption(surveyId);
  return {
    surveyId,
    responseCount: total,
    questions: survey.questions.map((question) => ({
      questionId: question.id,
      options: question.options.map((option) => toOptionResult(option.id, votes, total)),
    })),
  };
}

async function countResponses(surveyId: string): Promise<number> {
  const { count, error } = await supabase
    .from('responses')
    .select('id', { count: 'exact', head: true })
    .eq('survey_id', surveyId);
  if (error) throw error;
  return count ?? 0;
}

async function countVotesByOption(surveyId: string): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from('response_answers')
    .select('option_id, responses!inner(survey_id)')
    .eq('responses.survey_id', surveyId);
  if (error) throw error;
  const votes = new Map<string, number>();
  for (const answer of data ?? []) {
    const optionId = answer.option_id as string;
    votes.set(optionId, (votes.get(optionId) ?? 0) + 1);
  }
  return votes;
}

function toOptionResult(optionId: string, votes: Map<string, number>, total: number): OptionResult {
  const count = votes.get(optionId) ?? 0;
  const percentage = total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
  return { optionId, votes: count, percentage };
}
