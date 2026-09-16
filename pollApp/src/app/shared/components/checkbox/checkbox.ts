import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class Checkbox {
  checked = input(false);
  disabled = input(false);
  checkedChange = output<boolean>();

  onToggle(event: Event) {
    this.checkedChange.emit((event.target as HTMLInputElement).checked);
  }
}
