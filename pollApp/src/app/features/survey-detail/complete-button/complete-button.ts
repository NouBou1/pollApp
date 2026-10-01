import { Component, input, output } from '@angular/core';
import { Icon } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-complete-button',
  imports: [Icon],
  templateUrl: './complete-button.html',
  styleUrl: './complete-button.scss',
})
export class CompleteButton {
  disabled = input(false);
  clicked = output<MouseEvent>();
}
