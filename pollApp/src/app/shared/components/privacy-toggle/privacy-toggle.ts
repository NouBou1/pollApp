import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-privacy-toggle',
  templateUrl: './privacy-toggle.html',
  styleUrl: './privacy-toggle.scss',
})
export class PrivacyToggle {
  checked = input(false);
  checkedChange = output<boolean>();

  toggle() {
    this.checkedChange.emit(!this.checked());
  }
}
