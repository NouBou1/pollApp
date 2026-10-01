import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonPrimary } from '../../shared/components/button-primary/button-primary';
import { CloseIconButton } from '../../shared/components/close-icon-button/close-icon-button';
import { SortBySelect, SortOption } from '../../shared/components/sort-by-select/sort-by-select';
import { Toast } from '../../shared/components/toast/toast';
import { SurveyService } from '../../core/services/survey.service';
import { CreateSurveyDialog } from '../../core/services/create-survey-dialog';
import { CreateSurveyPayload, SURVEY_CATEGORIES } from '../../core/models/survey.model';
import { buildOption, QuestionForm, QuestionFormGroup } from './question-form-group/question-form-group';
import { Icon } from '../../shared/components/icon/icon';
import { dateOnlyFromToday, notBeforeTomorrow, notBlank } from './form-validators';

function buildQuestion(): QuestionForm {
  return new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: notBlank }),
    allowMultiple: new FormControl(false, { nonNullable: true }),
    options: new FormArray([buildOption(), buildOption()]),
  });
}

const REQUIRED_MESSAGE = 'Please fill in the survey name, a category and all questions and answers.';
const END_DATE_MESSAGE = 'Please choose an end date from tomorrow on.';

function endOfDayIso(dateOnly: string): string {
  return new Date(`${dateOnly}T23:59:59`).toISOString();
}

@Component({
  selector: 'app-create-survey',
  imports: [
    ReactiveFormsModule,
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
  readonly dialog = inject(CreateSurveyDialog);

  readonly categoryOptions: SortOption[] = SURVEY_CATEGORIES.map((category) => ({
    value: category,
    label: category,
  }));
  readonly minEndDate = dateOnlyFromToday(1);
  readonly submitting = signal(false);
  readonly submitAttempted = signal(false);
  readonly error = signal<string | null>(null);
  readonly publishedSurveyId = signal<string | null>(null);

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: notBlank }),
    description: new FormControl('', { nonNullable: true }),
    category: new FormControl('', { nonNullable: true, validators: Validators.required }),
    endDate: new FormControl(this.minEndDate, {
      nonNullable: true,
      validators: [Validators.required, notBeforeTomorrow],
    }),
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
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
      return;
    }
    const question = this.questions.at(0);
    question.controls.text.reset();
    question.controls.options.controls.forEach((option) => option.reset());
  }

  openPublishedSurvey() {
    const id = this.publishedSurveyId();
    this.dialog.close();
    if (id) this.router.navigate(['/survey', id]);
  }

  validationMessage(): string | null {
    if (!this.submitAttempted() || this.form.valid) return null;
    return this.form.controls.endDate.invalid ? END_DATE_MESSAGE : REQUIRED_MESSAGE;
  }

  submit() {
    this.submitAttempted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.surveyService.createSurvey(this.buildPayload()).subscribe({
      next: ({ id }) => this.publishedSurveyId.set(id),
      error: () => this.failSubmit('Could not publish the survey. Please try again.'),
    });
  }

  private buildPayload(): CreateSurveyPayload {
    const value = this.form.getRawValue();
    return {
      title: value.title.trim(),
      description: value.description.trim() || null,
      category: value.category,
      endsAt: endOfDayIso(value.endDate),
      questions: value.questions.map((question) => ({
        text: question.text.trim(),
        allowMultiple: question.allowMultiple,
        options: question.options.map((option) => ({ text: option.text.trim() })),
      })),
    };
  }

  private failSubmit(message: string) {
    this.error.set(message);
    this.submitting.set(false);
  }
}
