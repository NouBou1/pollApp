import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-mini',
  templateUrl: './button-mini.html',
  styleUrl: './button-mini.scss',
})
export class ButtonMini {
  disabled = input(false);
  variant = input<'default' | 'danger'>('default');
  clicked = output<void>();
}
