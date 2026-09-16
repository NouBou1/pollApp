import { Component, input, output } from '@angular/core';

/**
 * UI-only stub: there is no auth/ownership concept yet, so this toggle
 * doesn't affect anything server-side. Wire it up once accounts exist.
 */
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
