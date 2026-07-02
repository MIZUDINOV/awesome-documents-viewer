import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'viewer',
    loadChildren: () => import('./document/document.routes').then((m) => m.routes),
  },
];
