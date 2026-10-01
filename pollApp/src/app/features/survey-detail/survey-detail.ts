import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EMPTY, catchError, switchMap, timer } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SurveyService } from '../../core/services/survey.service';
import {
  SubmitResponsePayload,
  SurveyDetail as SurveyDetailModel,
  SurveyResults,
} from '../../core/models/survey.model';
import { ResultsPanel } from './results-panel/results-panel';
import { SurveyQuestion } from './survey-question/survey-question';
import { CompleteButton } from './complete-button/complete-button';
import { Icon } from '../../shared/components/icon/icon';

const RESULTS_POLL_MS = 5000;

@Component({
  selector: 'app-survey-detail',
  imports: [DatePipe, RouterLink, Icon, ResultsPanel, SurveyQuestion, CompleteButton],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly surveyService = inject(SurveyService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly survey = signal<SurveyDetailModel | null>(null);
  readonly results = signal<SurveyResults | null>(null);
  readonly selectedAnswers = signal<Record<string, string[]>>({});
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly resultsOpen = signal(true);

  readonly hasResponses = computed(() => (this.results()?.responseCount ?? 0) > 0);

  readonly isEnded = computed(() => {
    const endsAt = this.survey()?.endsAt;
    return !!endsAt && new Date(endsAt).getTime() <= Date.now();
  });

  readonly canSubmit = computed(() => {
    const survey = this.survey();
    if (!survey || this.isEnded()) return false;
    const answers = this.selectedAnswers();
    return survey.questions.every((question) => (answers[question.id]?.length ?? 0) > 0);
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSurvey(id);
      this.pollResults(id);
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

  private pollResults(id: string) {
    timer(0, RESULTS_POLL_MS)
      .pipe(
        switchMap(() => this.surveyService.getResults(id).pipe(catchError(() => EMPTY))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((results) => this.results.set(results));
  }

  private loadResults(id: string) {
    this.surveyService.getResults(id).subscribe({
      next: (results) => this.results.set(results),
      error: () => {},
    });
  }

  selectedIds(questionId: string): string[] {
    return this.selectedAnswers()[questionId] ?? [];
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
