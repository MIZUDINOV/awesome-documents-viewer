import { PercentPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-viewer-toolbar',
  templateUrl: './viewer-toolbar.html',
  styleUrls: ['./viewer-toolbar.css'],
  imports: [PercentPipe, MatToolbar, MatButton, MatIcon, MatIconButton],
})
export class ViewerToolbar {
  public readonly documentName = input.required<string>();
  public readonly zoom = input.required<number>();

  public readonly zoomIn = output<void>();
  public readonly zoomOut = output<void>();
  public readonly save = output<void>();
}
