import { Component, input, output } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-toast',
  imports: [Icon],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  visible = input(false);
  closed = output<void>();
}
