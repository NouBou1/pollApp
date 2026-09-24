import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';

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
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  options = input.required<SortOption[]>();
  value = input<string>('');
  label = input('Sort by');
  valueChange = output<string>();

  readonly open = signal(false);

  toggle() {
    this.open.update((isOpen) => !isOpen);
  }

  select(value: string) {
    this.valueChange.emit(value);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
