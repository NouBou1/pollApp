import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SurveyService } from '../../core/services/survey.service';
import {
  SubmitResponsePayload,
  SurveyDetail as SurveyDetailModel,
  SurveyResults,
  optionLetter,
} from '../../core/models/survey.model';
import { ResultsPanel } from './results-panel/results-panel';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-survey-detail',
  imports: [DatePipe, RouterLink, Icon, ResultsPanel],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly surveyService = inject(SurveyService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly survey = signal<SurveyDetailModel | null>(null);
  readonly results = signal<SurveyResults | null>(null);
  readonly selectedAnswers = signal<Record<string, string[]>>({});
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly letter = optionLetter;
  readonly resultsOpen = signal(true);

  readonly hasResponses = computed(() => (this.results()?.responseCount ?? 0) > 0);

  readonly canSubmit = computed(() => {
    const survey = this.survey();
    if (!survey) return false;
    const answers = this.selectedAnswers();
    return survey.questions.every((question) => (answers[question.id]?.length ?? 0) > 0);
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSurvey(id);
      this.loadResults(id);
    } else {
      this.error.set('Survey not found.');
      this.loading.set(false);
    }
  }

  private loadSurvey(id: string) {
    this.surveyService.getSurvey(id).subscribe({
      next: (survey) => {
        this.survey.set(survey);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load this survey.');
        this.loading.set(false);
      },
    });
  }

  private loadResults(id: string) {
    this.surveyService.getResults(id).subscribe({
      next: (results) => this.results.set(results),
      error: () => {},
    });
  }

  isSelected(questionId: string, optionId: string): boolean {
    return this.selectedAnswers()[questionId]?.includes(optionId) ?? false;
  }

  selectOption(questionId: string, optionId: string, allowMultiple: boolean) {
    this.selectedAnswers.update((answers) => {
      const current = answers[questionId] ?? [];
      if (!allowMultiple) {
        return { ...answers, [questionId]: [optionId] };
      }
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...answers, [questionId]: next };
    });
  }

  submit() {
    const survey = this.survey();
    if (!survey || !this.canSubmit()) return;
    this.submitting.set(true);
    this.surveyService.submitResponse(survey.id, { answers: this.collectAnswers() }).subscribe({
      next: () => this.onSubmitted(survey.id),
      error: () => {
        this.submitting.set(false);
        this.error.set('Could not submit your response.');
      },
    });
  }

  private collectAnswers(): SubmitResponsePayload['answers'] {
    return Object.entries(this.selectedAnswers()).flatMap(([questionId, optionIds]) =>
      optionIds.map((optionId) => ({ questionId, optionId })),
    );
  }

  private onSubmitted(surveyId: string) {
    this.submitting.set(false);
    this.submitted.set(true);
    this.loadResults(surveyId);
  }
}
