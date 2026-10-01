import { Component, computed, input, output } from '@angular/core';
import { FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CloseIconButton } from '../../../shared/components/close-icon-button/close-icon-button';
import { Checkbox } from '../../../shared/components/checkbox/checkbox';
import { Icon } from '../../../shared/components/icon/icon';
import { notBlank } from '../form-validators';

export type OptionForm = FormGroup<{ text: FormControl<string> }>;
export type QuestionForm = FormGroup<{
  text: FormControl<string>;
  allowMultiple: FormControl<boolean>;
  options: FormArray<OptionForm>;
}>;

const MAX_OPTIONS = 6;

const QUESTION_PLACEHOLDERS = [
  'Which date would work best for you?',
  'Choose the activities you prefer?',
];

export function buildOption(): OptionForm {
  return new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: notBlank }),
  });
}

@Component({
  selector: 'app-question-form-group',
  imports: [ReactiveFormsModule, CloseIconButton, Checkbox, Icon],
  templateUrl: './question-form-group.html',
  styleUrl: './question-form-group.scss',
})
export class QuestionFormGroup {
  question = input.required<QuestionForm>();
  index = input.required<number>();
  removable = input(false);
  removeQuestion = output<void>();

  get options(): FormArray<OptionForm> {
    return this.question().controls.options;
  }

  get allowMultiple(): FormControl<boolean> {
    return this.question().controls.allowMultiple;
  }

  readonly maxOptions = MAX_OPTIONS;

  readonly placeholder = computed(
    () => QUESTION_PLACEHOLDERS[this.index() % QUESTION_PLACEHOLDERS.length],
  );

  letter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  canAddOption(): boolean {
    return this.options.length < MAX_OPTIONS;
  }

  addOption() {
    if (this.canAddOption()) this.options.push(buildOption());
  }

  removeOption(index: number) {
    if (this.options.length <= 2) {
      this.options.at(index).reset();
      return;
    }
    this.options.removeAt(index);
  }
}
