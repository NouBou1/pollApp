import { hasEnded, optionLetter, toPercentage } from './survey.model';

describe('hasEnded', () => {
  it('returns false without an end date', () => {
    expect(hasEnded(null)).toBe(false);
  });

  it('returns true for a date in the past', () => {
    expect(hasEnded(new Date(Date.now() - 60_000).toISOString())).toBe(true);
  });

  it('returns false for a date in the future', () => {
    expect(hasEnded(new Date(Date.now() + 60_000).toISOString())).toBe(false);
  });
});

describe('optionLetter', () => {
  it('maps indexes to letters starting at A', () => {
    expect([0, 1, 5].map(optionLetter)).toEqual(['A', 'B', 'F']);
  });
});

describe('toPercentage', () => {
  it('returns 0 when there are no votes', () => {
    expect(toPercentage(0, 0)).toBe(0);
  });

  it('rounds to one decimal place', () => {
    expect(toPercentage(1, 3)).toBe(33.3);
    expect(toPercentage(2, 3)).toBe(66.7);
  });

  it('returns 100 when every vote went to one option', () => {
    expect(toPercentage(4, 4)).toBe(100);
  });
});
