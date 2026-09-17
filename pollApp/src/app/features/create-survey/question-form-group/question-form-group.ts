import { Component, input, output } from '@angular/core';
import { FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonMini } from '../../../shared/components/button-mini/button-mini';
import { CloseIconButton } from '../../../shared/components/close-icon-button/close-icon-button';
import { Checkbox } from '../../../shared/components/checkbox/checkbox';

export type OptionForm = FormGroup<{ text: FormControl<string> }>;
export type QuestionForm = FormGroup<{
  text: FormControl<string>;
  allowMultiple: FormControl<boolean>;
  options: FormArray<OptionForm>;
}>;

@Component({
  selector: 'app-question-form-group',
  imports: [ReactiveFormsModule, ButtonMini, CloseIconButton, Checkbox],
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

  addOption() {
    this.options.push(new FormGroup({ text: new FormControl('', { nonNullable: true }) }));
  }

  removeOption(index: number) {
    if (this.options.length <= 2) return;
    this.options.removeAt(index);
  }
}
