import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DocumentApi } from '../document-api';
import { ViewerToolbar } from './viewer-toolbar/viewer-toolbar';
import { DocumentPage } from './document-page/document-page';
import { Annotation, MoveAnnotation } from '../annotation';

const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;
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

  protected readonly annotationsDict = signal(new Map<number, Annotation[]>());
  protected readonly annotations = computed(() =>
    Array.from(this.annotationsDict().values()).flat(),
  );

  protected zoomIn(): void {
    this.zoom.update((value) => Math.min(value + ZOOM_STEP, MAX_ZOOM));
  }

  protected zoomOut(): void {
    this.zoom.update((value) => Math.max(value - ZOOM_STEP, MIN_ZOOM));
  }

  protected onAddAnnotation(annotation: Annotation): void {
    this.updatePageAnnotations(annotation.pageNumber, (annotations) => [...annotations, annotation]);
  }

  protected onUpdateAnnotation(annotation: Annotation): void {
    this.updatePageAnnotations(annotation.pageNumber, (annotations) =>
      annotations.map((item) => (item.id === annotation.id ? annotation : item)),
    );
  }

  protected onMoveAnnotation(move: MoveAnnotation): void {
    this.updatePageAnnotations(move.pageNumber, (annotations) =>
      annotations.map((annotation) =>
        annotation.id === move.id ? { ...annotation, x: move.x, y: move.y } : annotation,
      ),
    );
  }

  protected onRemoveAnnotation(annotation: Annotation): void {
    this.updatePageAnnotations(annotation.pageNumber, (annotations) =>
      annotations.filter(({ id }) => id !== annotation.id),
    );
  }

  private updatePageAnnotations(
    pageNumber: number,
    update: (annotations: Annotation[]) => Annotation[],
  ): void {
    this.annotationsDict.update((annotationsDict) => {
      const nextAnnotationsDict = new Map(annotationsDict);
      nextAnnotationsDict.set(pageNumber, update(nextAnnotationsDict.get(pageNumber) ?? []));

      return nextAnnotationsDict;
    });
  }
}
