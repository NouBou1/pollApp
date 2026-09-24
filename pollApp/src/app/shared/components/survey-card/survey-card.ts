import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SurveyListItem } from '../../../core/models/survey.model';

function formatEndsIn(endsAt: string | null): string | null {
  if (!endsAt) return null;
  const diffMs = new Date(endsAt).getTime() - Date.now();
  if (diffMs <= 0) return 'Ended';
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return days <= 1 ? 'Ends in 1 Day' : `Ends in ${days} Days`;
}

@Component({
  selector: 'app-survey-card',
  imports: [RouterLink],
  templateUrl: './survey-card.html',
  styleUrl: './survey-card.scss',
})
export class SurveyCard {
  survey = input.required<SurveyListItem>();
  highlight = input(false);
  wide = input(false);

  readonly endsInLabel = computed(() => formatEndsIn(this.survey().endsAt));
}
