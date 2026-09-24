import { Component, computed, input, output } from '@angular/core';
import { FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CloseIconButton } from '../../../shared/components/close-icon-button/close-icon-button';
import { Checkbox } from '../../../shared/components/checkbox/checkbox';

export type OptionForm = FormGroup<{ text: FormControl<string> }>;
export type QuestionForm = FormGroup<{
  text: FormControl<string>;
  allowMultiple: FormControl<boolean>;
  options: FormArray<OptionForm>;
}>;

const QUESTION_PLACEHOLDERS = [
  'Which date would work best for you?',
  'Choose the activities you prefer?',
];

export function buildOption(): OptionForm {
  return new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
}

@Component({
  selector: 'app-question-form-group',
  imports: [ReactiveFormsModule, CloseIconButton, Checkbox],
  templateUrl: './question-form-group.html',
  styleUrl: './question-form-group.scss',
})
export class QuestionFormGroup {
  question = input.required<QuestionForm>();
  index = input.required<number>();
  removeQuestion = output<void>();

  get options(): FormArray<OptionForm> {
    return this.question().controls.options;
  }

  get allowMultiple(): FormControl<boolean> {
    return this.question().controls.allowMultiple;
  }

  // Example questions from the Figma design, repeated for further questions.
  readonly placeholder = computed(
    () => QUESTION_PLACEHOLDERS[this.index() % QUESTION_PLACEHOLDERS.length],
  );

  letter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  addOption() {
    this.options.push(buildOption());
  }

  // A question needs at least two answers, so below that the trash icon just clears the text.
  removeOption(index: number) {
    if (this.options.length <= 2) {
      this.options.at(index).reset();
      return;
    }
    this.options.removeAt(index);
  }
}
