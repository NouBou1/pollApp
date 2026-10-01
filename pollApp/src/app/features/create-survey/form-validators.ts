import { AbstractControl, ValidationErrors } from '@angular/forms';

export function notBlank(control: AbstractControl<string>): ValidationErrors | null {
  return control.value.trim() ? null : { required: true };
}

export function dateOnlyFromToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export function notBeforeTomorrow(control: AbstractControl<string>): ValidationErrors | null {
  return control.value && control.value < dateOnlyFromToday(1) ? { tooEarly: true } : null;
}
