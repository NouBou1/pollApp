import { Component, input } from '@angular/core';

@Component({
  selector: 'app-category-tag',
  templateUrl: './category-tag.html',
  styleUrl: './category-tag.scss',
})
export class CategoryTag {
  category = input.required<string>();
}
