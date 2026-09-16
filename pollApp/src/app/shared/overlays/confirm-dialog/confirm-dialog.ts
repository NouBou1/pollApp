import { Component, input, output } from '@angular/core';
import { ButtonPrimary } from '../../components/button-primary/button-primary';
import { ButtonSecondary } from '../../components/button-secondary/button-secondary';
import { CloseIconButton } from '../../components/close-icon-button/close-icon-button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ButtonPrimary, ButtonSecondary, CloseIconButton],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  open = input(false);
  title = input('Are you sure?');
  message = input('');
  confirmLabel = input('Delete');

  confirmed = output<void>();
  cancelled = output<void>();
}
