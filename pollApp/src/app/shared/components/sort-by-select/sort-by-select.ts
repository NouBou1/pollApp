import { Component, input, output } from '@angular/core';

export interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-sort-by-select',
  templateUrl: './sort-by-select.html',
  styleUrl: './sort-by-select.scss',
})
export class SortBySelect {
  options = input.required<SortOption[]>();
  value = input<string>('');
  label = input('Sort by');
  valueChange = output<string>();

  onChange(event: Event) {
    this.valueChange.emit((event.target as HTMLSelectElement).value);
  }
}
