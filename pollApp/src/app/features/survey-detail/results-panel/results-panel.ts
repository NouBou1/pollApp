import { Component, computed, input } from '@angular/core';
import { SurveyDetail, SurveyResults, optionLetter } from '../../../core/models/survey.model';

interface QuestionResultView {
  questionId: string;
  text: string;
  options: { optionId: string; text: string; votes: number; percentage: number }[];
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

  readonly questionViews = computed<QuestionResultView[]>(() => {
    const results = this.results();
    return this.survey().questions.map((question) => {
      const resultQuestion = results?.questions.find((q) => q.questionId === question.id);
      return {
        questionId: question.id,
        text: question.text,
        options: question.options.map((option) => {
          const resultOption = resultQuestion?.options.find((o) => o.optionId === option.id);
          return {
            optionId: option.id,
            text: option.text,
            votes: resultOption?.votes ?? 0,
            percentage: resultOption?.percentage ?? 0,
          };
        }),
      };
    });
  });
}
