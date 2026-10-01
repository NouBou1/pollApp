import { Component, computed, input } from '@angular/core';
import {
  SurveyDetail,
  SurveyOption,
  SurveyQuestion,
  SurveyResults,
  optionLetter,
  toPercentage,
} from '../../../core/models/survey.model';

type QuestionResult = SurveyResults['questions'][number];

interface OptionResultView {
  optionId: string;
  text: string;
  votes: number;
  percentage: number;
}

interface QuestionResultView {
  questionId: string;
  text: string;
  options: OptionResultView[];
}

interface ResultContext {
  result?: QuestionResult;
  previewIds: string[];
  total: number;
}

function toOptionView(option: SurveyOption, context: ResultContext): OptionResultView {
  const resultOption = context.result?.options.find((o) => o.optionId === option.id);
  const votes = (resultOption?.votes ?? 0) + (context.previewIds.includes(option.id) ? 1 : 0);
  return {
    optionId: option.id,
    text: option.text,
    votes,
    percentage: toPercentage(votes, context.total),
  };
}

function toQuestionView(question: SurveyQuestion, context: ResultContext): QuestionResultView {
  return {
    questionId: question.id,
    text: question.text,
    options: question.options.map((option) => toOptionView(option, context)),
  };
}

@Component({
  selector: 'app-results-panel',
  templateUrl: './results-panel.html',
  styleUrl: './results-panel.scss',
})
export class ResultsPanel {
  survey = input.required<SurveyDetail>();
  results = input<SurveyResults | null>(null);
  preview = input<Record<string, string[]>>({});

  readonly letter = optionLetter;

  readonly hasPreview = computed(() => Object.values(this.preview()).some((ids) => ids.length > 0));

  readonly total = computed(() => (this.results()?.responseCount ?? 0) + (this.hasPreview() ? 1 : 0));

  readonly hasResponses = computed(() => this.total() > 0);

  readonly questionViews = computed(() =>
    this.survey().questions.map((question) =>
      toQuestionView(question, {
        result: this.results()?.questions.find((q) => q.questionId === question.id),
        previewIds: this.preview()[question.id] ?? [],
        total: this.total(),
      }),
    ),
  );
}
