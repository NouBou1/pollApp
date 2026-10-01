import { Injectable } from '@angular/core';

const STORAGE_KEY = 'pollapp-answered-surveys';

@Injectable({ providedIn: 'root' })
export class AnsweredSurveys {
  has(surveyId: string): boolean {
    return this.read().includes(surveyId);
  }

  add(surveyId: string) {
    const ids = this.read();
    if (ids.includes(surveyId)) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, surveyId]));
    } catch {}
  }

  private read(): string[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
