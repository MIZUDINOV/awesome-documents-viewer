import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

interface Document {
  name: string;
  pages: Page[];
}

interface Page {
  number: number;
  imageUrl: string;
}

@Service()
export class DocumentApi {
  private readonly http = inject(HttpClient);

  public getDocumentById(id: string): Observable<Document> {
    return this.http.get<Document>(`/mocks/documents/${id}.json`);
  }
}
