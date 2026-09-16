import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-secondary',
  templateUrl: './button-secondary.html',
  styleUrl: './button-secondary.scss',
})
export class ButtonSecondary {
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
  clicked = output<void>();
}
