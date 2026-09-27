import { Component, input, output } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-button-primary',
  imports: [Icon],
  templateUrl: './button-primary.html',
  styleUrl: './button-primary.scss',
})
export class ButtonPrimary {
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
  /** Shows this icon permanently on mobile. */
  mobileIcon = input<'plus' | 'check' | null>(null);
  clicked = output<void>();
}
