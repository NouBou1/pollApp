import { supabase } from '../config/supabaseClient.js';
import type {
  CreateSurveyPayload,
  SubmitResponsePayload,
  SurveyDetail,
  SurveyListItem,
  SurveyResults,
} from '../types/dto.js';

export async function listSurveys(): Promise<SurveyListItem[]> {
  const { data, error } = await supabase
    .from('surveys')
    .select('id, title, category, created_at, ends_at, questions(count)')
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    createdAt: row.created_at,
    endsAt: row.ends_at,
    questionCount: (row.questions as unknown as { count: number }[])[0]?.count ?? 0,
  }));
}

export async function getSurvey(surveyId: string): Promise<SurveyDetail | null> {
  const { data: survey, error: surveyError } = await supabase
    .from('surveys')
    .select('id, title, description, category, created_at, ends_at')
    .eq('id', surveyId)
    .maybeSingle();
  if (surveyError) throw surveyError;
  if (!survey) return null;

  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('id, text, position, allow_multiple, options(id, text, position)')
    .eq('survey_id', surveyId)
    .order('position', { ascending: true });
  if (questionsError) throw questionsError;

  return {
    id: survey.id,
    title: survey.title,
    description: survey.description,
    category: survey.category,
    createdAt: survey.created_at,
    endsAt: survey.ends_at,
    questions: (questions ?? []).map((q) => ({
      id: q.id,
      text: q.text,
      position: q.position,
      allowMultiple: q.allow_multiple,
      options: (q.options ?? [])
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((o) => ({ id: o.id, text: o.text, position: o.position })),
    })),
  };
}

export async function createSurvey(payload: CreateSurveyPayload): Promise<{ id: string }> {
  const { data: survey, error: surveyError } = await supabase
    .from('surveys')
    .insert({
      title: payload.title,
      description: payload.description ?? null,
      category: payload.category,
      ends_at: payload.endsAt ?? null,
    })
    .select('id')
    .single();
  if (surveyError) throw surveyError;

  const surveyId = survey.id as string;

  try {
    for (const [qIndex, question] of payload.questions.entries()) {
      const { data: insertedQuestion, error: questionError } = await supabase
        .from('questions')
        .insert({
          survey_id: surveyId,
          text: question.text,
          position: qIndex,
          allow_multiple: question.allowMultiple ?? false,
        })
        .select('id')
        .single();
      if (questionError) throw questionError;

      const optionsRows = question.options.map((option, oIndex) => ({
        question_id: insertedQuestion.id as string,
        text: option.text,
        position: oIndex,
      }));
      const { error: optionsError } = await supabase.from('options').insert(optionsRows);
      if (optionsError) throw optionsError;
    }
  } catch (err) {
    await supabase.from('surveys').delete().eq('id', surveyId);
    throw err;
  }

  return { id: surveyId };
}

export async function deleteSurvey(surveyId: string): Promise<void> {
  const { error } = await supabase.from('surveys').delete().eq('id', surveyId);
  if (error) throw error;
}

export async function submitResponse(
  surveyId: string,
  payload: SubmitResponsePayload,
): Promise<void> {
  const { data: response, error: responseError } = await supabase
    .from('responses')
    .insert({ survey_id: surveyId })
    .select('id')
    .single();
  if (responseError) throw responseError;

  const answerRows = payload.answers.map((answer) => ({
    response_id: response.id as string,
    question_id: answer.questionId,
    option_id: answer.optionId,
  }));
  const { error: answersError } = await supabase.from('response_answers').insert(answerRows);
  if (answersError) {
    await supabase.from('responses').delete().eq('id', response.id);
    throw answersError;
  }
}

export async function getResults(surveyId: string): Promise<SurveyResults | null> {
  const survey = await getSurvey(surveyId);
  if (!survey) return null;

  const { count: responseCount, error: countError } = await supabase
    .from('responses')
    .select('id', { count: 'exact', head: true })
    .eq('survey_id', surveyId);
  if (countError) throw countError;

  const { data: answers, error: answersError } = await supabase
    .from('response_answers')
    .select('question_id, option_id, responses!inner(survey_id)')
    .eq('responses.survey_id', surveyId);
  if (answersError) throw answersError;

  const votesByOption = new Map<string, number>();
  for (const answer of answers ?? []) {
    const optionId = answer.option_id as string;
    votesByOption.set(optionId, (votesByOption.get(optionId) ?? 0) + 1);
  }

  const total = responseCount ?? 0;
  return {
    surveyId,
    responseCount: total,
    questions: survey.questions.map((question) => ({
      questionId: question.id,
      options: question.options.map((option) => {
        const votes = votesByOption.get(option.id) ?? 0;
        return {
          optionId: option.id,
          votes,
          percentage: total > 0 ? Math.round((votes / total) * 1000) / 10 : 0,
        };
      }),
    })),
  };
}
