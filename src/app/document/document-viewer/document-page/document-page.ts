import { Component, input, output } from '@angular/core';
import { Page } from '../../document';
import { Annotation, MoveAnnotation, TextAnnotationType } from '../../annotation';
import { AnnotationLayer } from '../annotation-layer/annotation-layer';

@Component({
  selector: 'app-document-page',
  templateUrl: './document-page.html',
  styleUrls: ['./document-page.css'],
  imports: [AnnotationLayer],
})
export class DocumentPage {
  public readonly page = input.required<Page>();
  public readonly pageWidth = input.required<number>();
  public readonly zoom = input.required<number>();
  public readonly annotations = input.required<Annotation[]>();

  public readonly addAnnotation = output<TextAnnotationType>();
  public readonly updateAnnotation = output<TextAnnotationType>();
  public readonly moveAnnotation = output<MoveAnnotation>();
  public readonly removeAnnotation = output<Annotation>();
}
