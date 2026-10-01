import { Component, output } from '@angular/core';
import { Icon } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-create-survey-header',
  imports: [Icon],
  templateUrl: './create-survey-header.html',
  styleUrl: './create-survey-header.scss',
})
export class CreateSurveyHeader {
  cancelled = output<void>();
}
