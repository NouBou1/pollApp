import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-primary',
  templateUrl: './button-primary.html',
  styleUrl: './button-primary.scss',
})
export class ButtonPrimary {
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
  /** Shows the plus icon permanently on mobile. */
  mobileIcon = input(false);
  clicked = output<void>();
}
