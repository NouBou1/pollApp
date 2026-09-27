import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'create-survey',
    loadComponent: () => import('./features/create-survey/create-survey').then((m) => m.CreateSurvey),
  },
  {
    path: 'survey/:id',
    data: { theme: 'light' },
    loadComponent: () =>
      import('./features/survey-detail/survey-detail').then((m) => m.SurveyDetail),
  },
  { path: '**', redirectTo: 'home' },
];
