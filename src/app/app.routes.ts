import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/design-system/design-system-page/design-system-page').then((m) => m.DesignSystemPage),
  },
];
