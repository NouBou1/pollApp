import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonPrimary } from '../../shared/components/button-primary/button-primary';
import { SortBySelect, SortOption } from '../../shared/components/sort-by-select/sort-by-select';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { SurveyService } from '../../core/services/survey.service';
import { SURVEY_CATEGORIES, SurveyListItem } from '../../core/models/survey.model';

const CATEGORY_OPTIONS: SortOption[] = [
  { value: 'all', label: 'All Surveys' },
  ...SURVEY_CATEGORIES.map((category) => ({ value: category, label: category })),
];

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonPrimary, SortBySelect, SurveyCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly surveyService = inject(SurveyService);

  readonly categoryOptions = CATEGORY_OPTIONS;
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly surveys = signal<SurveyListItem[]>([]);
  readonly categoryFilter = signal('all');
  readonly statusFilter = signal<'active' | 'past'>('active');

  private isPast(survey: SurveyListItem): boolean {
    return !!survey.endsAt && new Date(survey.endsAt).getTime() <= Date.now();
  }

  readonly endingSoonSurveys = computed(() =>
    this.surveys()
      .filter((survey) => survey.endsAt && !this.isPast(survey))
      .sort((a, b) => (a.endsAt! < b.endsAt! ? -1 : 1))
      .slice(0, 5),
  );

  readonly filteredSurveys = computed(() => {
    const category = this.categoryFilter();
    const status = this.statusFilter();
    return this.surveys()
      .filter((survey) => category === 'all' || survey.category === category)
      .filter((survey) => (status === 'past' ? this.isPast(survey) : !this.isPast(survey)))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  });

  constructor() {
    this.loadSurveys();
  }

  loadSurveys() {
    this.loading.set(true);
    this.error.set(null);
    this.surveyService.listSurveys().subscribe({
      next: (surveys) => {
        this.surveys.set(surveys);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load surveys. Please try again later.');
        this.loading.set(false);
      },
    });
  }
}
