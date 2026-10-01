import { Component, input, output } from '@angular/core';
import { SurveyQuestion as SurveyQuestionModel, optionLetter } from '../../../core/models/survey.model';

@Component({
  selector: 'app-survey-question',
  templateUrl: './survey-question.html',
  styleUrl: './survey-question.scss',
})
export class SurveyQuestion {
  question = input.required<SurveyQuestionModel>();
  index = input.required<number>();
  selectedIds = input<string[]>([]);
  disabled = input(false);
  optionSelected = output<string>();

  readonly letter = optionLetter;
}
