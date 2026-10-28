import { FormControl } from '@angular/forms';
import { dateOnlyFromToday, notBeforeTomorrow, notBlank } from './form-validators';

describe('notBlank', () => {
  it('rejects empty and whitespace-only values', () => {
    expect(notBlank(new FormControl('', { nonNullable: true }))).toEqual({ required: true });
    expect(notBlank(new FormControl('   ', { nonNullable: true }))).toEqual({ required: true });
  });

  it('accepts text', () => {
    expect(notBlank(new FormControl(' Pizza ', { nonNullable: true }))).toBeNull();
  });
});

describe('dateOnlyFromToday', () => {
  it('returns a YYYY-MM-DD string', () => {
    expect(dateOnlyFromToday(0)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('orders days chronologically', () => {
    expect(dateOnlyFromToday(0) < dateOnlyFromToday(1)).toBe(true);
  });
});

describe('notBeforeTomorrow', () => {
  const validate = (value: string) =>
    notBeforeTomorrow(new FormControl(value, { nonNullable: true }));

  it('rejects today', () => {
    expect(validate(dateOnlyFromToday(0))).toEqual({ tooEarly: true });
  });

  it('accepts tomorrow and later', () => {
    expect(validate(dateOnlyFromToday(1))).toBeNull();
    expect(validate(dateOnlyFromToday(30))).toBeNull();
  });

  it('leaves empty values to the required validator', () => {
    expect(validate('')).toBeNull();
  });
});
