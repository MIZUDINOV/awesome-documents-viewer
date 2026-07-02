import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'view/:documentId',
    loadComponent: () =>
      import('./document-viewer/document-viewer').then((c) => c.DocumentViewerComponent),
  },
];
