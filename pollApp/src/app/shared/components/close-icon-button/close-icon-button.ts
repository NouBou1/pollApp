import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-close-icon-button',
  templateUrl: './close-icon-button.html',
  styleUrl: './close-icon-button.scss',
})
export class CloseIconButton {
  ariaLabel = input('Close');
  onLight = input(false);
  clicked = output<MouseEvent>();
}
