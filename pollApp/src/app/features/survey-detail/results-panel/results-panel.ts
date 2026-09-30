import { Component, computed, input } from '@angular/core';
import {
  SurveyDetail,
  SurveyOption,
  SurveyQuestion,
  SurveyResults,
  optionLetter,
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

function toOptionView(option: SurveyOption, result?: QuestionResult): OptionResultView {
  const resultOption = result?.options.find((o) => o.optionId === option.id);
  return {
    optionId: option.id,
    text: option.text,
    votes: resultOption?.votes ?? 0,
    percentage: resultOption?.percentage ?? 0,
  };
}

function toQuestionView(question: SurveyQuestion, results: SurveyResults | null): QuestionResultView {
  const result = results?.questions.find((q) => q.questionId === question.id);
  return {
    questionId: question.id,
    text: question.text,
    options: question.options.map((option) => toOptionView(option, result)),
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

  readonly letter = optionLetter;

  readonly hasResponses = computed(() => (this.results()?.responseCount ?? 0) > 0);

  readonly questionViews = computed(() =>
    this.survey().questions.map((question) => toQuestionView(question, this.results())),
  );
}
