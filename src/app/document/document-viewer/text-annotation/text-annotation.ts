import { Component, ElementRef, computed, effect, input, output, signal, viewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MoveAnnotation, TextAnnotationType } from '../../annotation';

interface DragState {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
  pageWidth: number;
  pageHeight: number;
  annotationWidth: number;
}

@Component({
  selector: 'app-text-annotation',
  templateUrl: './text-annotation.html',
  styleUrls: ['./text-annotation.css'],
  imports: [MatIcon, MatIconButton],
})
export class TextAnnotation {
  readonly annotation = input.required<TextAnnotationType>();

  readonly deleteAnnotation = output<string>();

  readonly updateAnnotation = output<TextAnnotationType>();

  readonly moveAnnotation = output<MoveAnnotation>();

  private dragState: DragState | null = null;
  private readonly textInput = viewChild<ElementRef<HTMLTextAreaElement>>('textInput');

  readonly previewX = signal<number | null>(null);
  readonly previewY = signal<number | null>(null);

  readonly currentX = computed(() => this.previewX() ?? this.annotation().x);

  readonly currentY = computed(() => this.previewY() ?? this.annotation().y);

  constructor() {
    effect(() => {
      if (this.annotation().text === '') {
        setTimeout(() => {
          const textInput = this.textInput()?.nativeElement;

          textInput?.focus();
          if (textInput) this.resizeTextArea(textInput);
        });
      }
    });
  }

  onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const element = event.currentTarget as HTMLElement;
    const pageElement = element.closest('.page') as HTMLElement | null;

    if (!pageElement) {
      return;
    }

    element.setPointerCapture(event.pointerId);

    const pageRect = pageElement.getBoundingClientRect();

    this.dragState = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: this.annotation().x,
      startY: this.annotation().y,
      pageWidth: pageRect.width,
      pageHeight: pageRect.height,
      annotationWidth: element.offsetWidth,
    };
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragState || event.pointerId !== this.dragState.pointerId) {
      return;
    }

    const nextPosition = this.getNextPosition(event);

    this.previewX.set(nextPosition.x);
    this.previewY.set(nextPosition.y);
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.dragState || event.pointerId !== this.dragState.pointerId) {
      return;
    }

    const nextPosition = this.getNextPosition(event);

    this.moveAnnotation.emit({
      id: this.annotation().id,
      pageNumber: this.annotation().pageNumber,
      x: nextPosition.x,
      y: nextPosition.y,
    });

    this.clearDragState(event);
  }

  onPointerCancel(event: PointerEvent): void {
    this.clearDragState(event);
  }

  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();

    this.deleteAnnotation.emit(this.annotation().id);
  }

  saveText(text: string): void {
    const trimmedText = text.trim();

    if (!trimmedText) {
      this.deleteAnnotation.emit(this.annotation().id);
      return;
    }

    this.updateAnnotation.emit({ ...this.annotation(), text: trimmedText });
  }

  onTextKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.ctrlKey) {
      return;
    }

    event.preventDefault();
    (event.currentTarget as HTMLTextAreaElement).blur();
  }

  resizeTextArea(eventOrElement: Event | HTMLTextAreaElement): void {
    const element =
      eventOrElement instanceof HTMLTextAreaElement
        ? eventOrElement
        : (eventOrElement.currentTarget as HTMLTextAreaElement);

    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }

  private getNextPosition(event: PointerEvent): { x: number; y: number } {
    if (!this.dragState) {
      return {
        x: this.annotation().x,
        y: this.annotation().y,
      };
    }

    const dx = event.clientX - this.dragState.startClientX;
    const dy = event.clientY - this.dragState.startClientY;

    const maxX = Math.max(0, 1 - this.dragState.annotationWidth / this.dragState.pageWidth);

    return {
      x: clamp(this.dragState.startX + dx / this.dragState.pageWidth, maxX),
      y: clamp(this.dragState.startY + dy / this.dragState.pageHeight),
    };
  }

  private clearDragState(event: PointerEvent): void {
    const element = event.currentTarget as HTMLElement;

    if (this.dragState) {
      element.releasePointerCapture(this.dragState.pointerId);
    }

    this.dragState = null;
    this.previewX.set(null);
    this.previewY.set(null);
  }
}

function clamp(value: number, max = 1): number {
  return Math.min(max, Math.max(0, value));
}
