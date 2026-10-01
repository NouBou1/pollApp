import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  host: {
    '(click)': 'onBackdropClick($event)',
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class Dialog {
  ariaLabel = input('Dialog');
  closed = output<void>();

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) this.closed.emit();
  }
}
