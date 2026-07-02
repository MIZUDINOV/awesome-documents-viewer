import { Component, input } from '@angular/core';
import { Page } from '../../document-api';

@Component({
  selector: 'app-document-page',
  templateUrl: './document-page.html',
  styleUrls: ['./document-page.css'],
})
export class DocumentPage {
  public readonly page = input.required<Page>();
  public readonly pageWidth = input.required<number>();
}
