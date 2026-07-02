import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

export interface Document {
  name: string;
  pages: Page[];
}

export interface Page {
  number: number;
  imageUrl: `pages/${number}.png`;
}

@Service()
export class DocumentApi {
  private readonly http = inject(HttpClient);

  public getDocumentById(id: string): Observable<Document> {
    return this.http.get<Document>(`/mocks/documents/${id}.json`);
  }
}
