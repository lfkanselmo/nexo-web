import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'contracts',
  },
  {
    path: 'contracts',
    loadComponent: () => import('./features/contracts/contracts-list-page/contracts-list-page').then((m) => m.ContractsListPage),
  },
  {
    path: 'contracts/new',
    loadComponent: () => import('./features/contracts/contract-form-page/contract-form-page').then((m) => m.ContractFormPage),
  },
  {
    path: 'contracts/:id',
    loadComponent: () => import('./features/contracts/contract-detail-page/contract-detail-page').then((m) => m.ContractDetailPage),
  },
  {
    path: 'properties',
    loadComponent: () => import('./features/properties/properties-page/properties-page').then((m) => m.PropertiesPage),
  },
  {
    path: 'tenants',
    loadComponent: () => import('./features/tenants/tenants-page/tenants-page').then((m) => m.TenantsPage),
  },
  {
    path: 'design-system',
    loadComponent: () => import('./features/design-system/design-system-page/design-system-page').then((m) => m.DesignSystemPage),
  },
];
