import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Imprint } from './features/imprint/imprint';
import { SurveyDetail } from './features/survey-detail/survey-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'survey/:id', data: { theme: 'light' }, component: SurveyDetail },
  { path: 'impressum', data: { theme: 'light', imprintLink: false }, component: Imprint },
  { path: '**', redirectTo: 'home' },
];
