import { Component } from '@angular/core';
import { PaintToolComponent } from './paint-tool/paint-tool.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PaintToolComponent],
  template: `
    <app-paint-tool></app-paint-tool>
  `
})
export class AppComponent {}