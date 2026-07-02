import { Component, computed, input, output } from '@angular/core';
import { Annotation, MoveAnnotation, TextAnnotationType } from '../../annotation';
import { TextAnnotation } from '../text-annotation/text-annotation';

const MAX_TEXT_ANNOTATION_WIDTH = 240;
const MIN_TEXT_ANNOTATION_HEIGHT = 34;

@Component({
  selector: 'app-annotation-layer',
  templateUrl: './annotation-layer.html',
  styleUrls: ['./annotation-layer.css'],
  imports: [TextAnnotation],
})
export class AnnotationLayer {
  public readonly annotations = input.required<Annotation[]>();
  public readonly pageNumber = input.required<number>();
  public readonly zoom = input.required<number>();
  protected readonly pageAnnotations = computed(() =>
    this.annotations().filter((annotation) => annotation.pageNumber === this.pageNumber()),
  );
  private skipNextLayerClick = false;

  public readonly addAnnotation = output<TextAnnotationType>();
  public readonly updateAnnotation = output<TextAnnotationType>();
  readonly moveAnnotation = output<MoveAnnotation>();
  public readonly removeAnnotation = output<Annotation>();

  onLayerPointerDown(event: PointerEvent): void {
    if (event.target === event.currentTarget && this.pageAnnotations().some(({ text }) => text === '')) {
      this.skipNextLayerClick = true;
    }
  }

  onLayerClick(event: MouseEvent): void {
    if (this.skipNextLayerClick) {
      this.skipNextLayerClick = false;
      return;
    }

    if (event.target !== event.currentTarget) {
      return;
    }

    const layer = event.currentTarget as HTMLElement;
    const rect = layer.getBoundingClientRect();

    const maxX = Math.max(0, 1 - (MAX_TEXT_ANNOTATION_WIDTH * this.zoom()) / rect.width);
    const maxY = Math.max(0, 1 - (MIN_TEXT_ANNOTATION_HEIGHT * this.zoom()) / rect.height);
    const x = clamp((event.clientX - rect.left) / rect.width, maxX);
    const y = clamp((event.clientY - rect.top) / rect.height, maxY);

    this.addAnnotation.emit({
      id: crypto.randomUUID(),
      pageNumber: this.pageNumber(),
      type: 'text',
      x,
      y,
      text: '',
    });
  }

  onUpdateAnnotation(annotation: TextAnnotationType): void {
    this.updateAnnotation.emit(annotation);
  }

  onRemoveAnnotation(annotation: Annotation): void {
    this.removeAnnotation.emit(annotation);
  }
}

function clamp(value: number, max = 1): number {
  return Math.min(max, Math.max(0, value));
}
