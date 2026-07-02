export type AnnotationType = 'text';

export interface BaseAnnotation {
  id: string;
  pageNumber: number;
  type: AnnotationType;
  x: number;
  y: number;
}

export interface TextAnnotationType extends BaseAnnotation {
  type: 'text';
  text: string;
}

export type Annotation = TextAnnotationType;

export type MoveAnnotation = Pick<Annotation, 'id' | 'pageNumber' | 'x' | 'y'>;
