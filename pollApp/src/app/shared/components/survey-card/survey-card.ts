import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CloseIconButton } from '../close-icon-button/close-icon-button';
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
  imports: [RouterLink, CloseIconButton],
  templateUrl: './survey-card.html',
  styleUrl: './survey-card.scss',
})
export class SurveyCard {
  survey = input.required<SurveyListItem>();
  highlight = input(false);
  wide = input(false);
  deleteRequested = output<string>();

  readonly endsInLabel = computed(() => formatEndsIn(this.survey().endsAt));

  onDeleteClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.deleteRequested.emit(this.survey().id);
  }
}
