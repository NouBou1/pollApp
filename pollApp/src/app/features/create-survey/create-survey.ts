import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonPrimary } from '../../shared/components/button-primary/button-primary';
import { CloseIconButton } from '../../shared/components/close-icon-button/close-icon-button';
import { SortBySelect, SortOption } from '../../shared/components/sort-by-select/sort-by-select';
import { Toast } from '../../shared/components/toast/toast';
import { SurveyService } from '../../core/services/survey.service';
import { CreateSurveyPayload, SURVEY_CATEGORIES } from '../../core/models/survey.model';
import { buildOption, QuestionForm, QuestionFormGroup } from './question-form-group/question-form-group';
import { Icon } from '../../shared/components/icon/icon';

function buildQuestion(): QuestionForm {
  return new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: Validators.required }),
    allowMultiple: new FormControl(false, { nonNullable: true }),
    options: new FormArray([buildOption(), buildOption()]),
  });
}

function endOfDayIso(dateOnly: string): string {
  return new Date(`${dateOnly}T23:59:59`).toISOString();
}

@Component({
  selector: 'app-create-survey',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonPrimary,
    CloseIconButton,
    Icon,
    SortBySelect,
    Toast,
    QuestionFormGroup,
  ],
  templateUrl: './create-survey.html',
  styleUrl: './create-survey.scss',
})
export class CreateSurvey {
  private readonly surveyService = inject(SurveyService);
  private readonly router = inject(Router);

  readonly categoryOptions: SortOption[] = SURVEY_CATEGORIES.map((category) => ({
    value: category,
    label: category,
  }));
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly publishedSurveyId = signal<string | null>(null);

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
    description: new FormControl('', { nonNullable: true }),
    category: new FormControl('', { nonNullable: true, validators: Validators.required }),
    endDate: new FormControl('', { nonNullable: true }),
    questions: new FormArray([buildQuestion()]),
  });

  get questions(): FormArray<QuestionForm> {
    return this.form.controls.questions;
  }

  clear(control: 'title' | 'description' | 'endDate') {
    this.form.controls[control].reset();
  }

  addQuestion() {
    this.questions.push(buildQuestion());
  }

  removeQuestion(index: number) {
    if (this.questions.length <= 1) return;
    this.questions.removeAt(index);
  }

  openPublishedSurvey() {
    const id = this.publishedSurveyId();
    if (id) this.router.navigate(['/survey', id]);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Please fill in the survey name, a category and all questions and answers.');
      return;
    }

    const value = this.form.getRawValue();
    const payload: CreateSurveyPayload = {
      title: value.title,
      description: value.description.trim() ? value.description.trim() : null,
      category: value.category,
      endsAt: value.endDate ? endOfDayIso(value.endDate) : null,
      questions: value.questions.map((question) => ({
        text: question.text,
        allowMultiple: question.allowMultiple,
        options: question.options.map((option) => ({ text: option.text })),
      })),
    };

    this.submitting.set(true);
    this.error.set(null);
    this.surveyService.createSurvey(payload).subscribe({
      next: ({ id }) => this.publishedSurveyId.set(id),
      error: () => {
        this.error.set('Could not publish the survey. Is the backend running?');
        this.submitting.set(false);
      },
    });
  }
}
