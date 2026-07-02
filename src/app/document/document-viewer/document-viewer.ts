import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DocumentApi } from '../document-api';
import { ViewerToolbar } from './viewer-toolbar/viewer-toolbar';
import { DocumentPage } from './document-page/document-page';

const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.2;
const PAGE_WIDTH = 800;

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.html',
  styleUrls: ['./document-viewer.css'],
  imports: [ViewerToolbar, DocumentPage],
})
export class DocumentViewer {
  private readonly documentApi = inject(DocumentApi);

  protected readonly documentId = input.required<string>();

  protected readonly document = rxResource({
    params: () => this.documentId(),
    stream: ({ params }) => this.documentApi.getDocumentById(params),
  });

  protected readonly documentName = computed(
    () => this.document.value()?.name ?? 'Untitled Document',
  );
  protected readonly pages = computed(() => this.document.value()?.pages ?? []);

  protected readonly zoom = signal(DEFAULT_ZOOM);

  protected readonly pageWidth = computed(() => Math.round(PAGE_WIDTH * this.zoom()));

  protected zoomIn(): void {
    this.zoom.update((value) => Math.min(value + ZOOM_STEP, MAX_ZOOM));
  }

  protected zoomOut(): void {
    this.zoom.update((value) => Math.max(value - ZOOM_STEP, MIN_ZOOM));
  }
}
