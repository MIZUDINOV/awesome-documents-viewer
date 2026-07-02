import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DocumentApi } from '../document-api';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.html',
  styleUrls: ['./document-viewer.css'],
})
export class DocumentViewerComponent {
  private readonly documentApi = inject(DocumentApi);

  protected readonly documentId = input.required<string>();
  protected readonly document = rxResource({
    params: () => this.documentId(),
    stream: ({ params }) => this.documentApi.getDocumentById(params),
  });
}
