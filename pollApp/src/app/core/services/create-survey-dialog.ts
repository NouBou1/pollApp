import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CreateSurveyDialog {
  private readonly openState = signal(false);
  readonly isOpen = this.openState.asReadonly();

  open() {
    this.openState.set(true);
  }

  close() {
    this.openState.set(false);
  }
}
