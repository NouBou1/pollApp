import { AnsweredSurveys } from './answered-surveys';

describe('AnsweredSurveys', () => {
  let answered: AnsweredSurveys;

  beforeEach(() => {
    localStorage.clear();
    answered = new AnsweredSurveys();
  });

  it('starts without answered surveys', () => {
    expect(answered.has('survey-1')).toBe(false);
  });

  it('remembers added surveys', () => {
    answered.add('survey-1');
    expect(answered.has('survey-1')).toBe(true);
    expect(answered.has('survey-2')).toBe(false);
  });

  it('persists across instances', () => {
    answered.add('survey-1');
    expect(new AnsweredSurveys().has('survey-1')).toBe(true);
  });

  it('stores each survey only once', () => {
    answered.add('survey-1');
    answered.add('survey-1');
    expect(JSON.parse(localStorage.getItem('pollapp-answered-surveys')!)).toEqual(['survey-1']);
  });

  it('ignores corrupt storage', () => {
    localStorage.setItem('pollapp-answered-surveys', '{not json');
    expect(answered.has('survey-1')).toBe(false);
  });
});
