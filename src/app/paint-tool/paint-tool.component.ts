import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import correctly
import { FormsModule } from '@angular/forms';    // Import FormsModule
import { jsPDF } from 'jspdf';
import { IndexedDbService } from '../indexed-db.service';

@Component({
  selector: 'app-paint-tool',
  standalone: true,        
  imports: [CommonModule] , // Ensure this is valid
  templateUrl: './paint-tool.component.html',
  styleUrls: ['./paint-tool.component.css']
})
export class PaintToolComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('textInput') textInput!: ElementRef<HTMLInputElement>;

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private history: ImageData[] = [];
  private historyIndex = -1;

  currentTool = 'brush';
  brushColor = '#000000';
  brushSize = 5;
  isTextMode = false;
  currentText = '';
  textPosition = { x: 0, y: 0 };

  canvasDataList: any[] = [];

  get canUndo(): boolean {
    return this.historyIndex > 0;
  }

  get canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  constructor(private indexedDbService: IndexedDbService) { }

  ngOnInit() {
    this.loadCanvasData();
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const dpr = window.devicePixelRatio || 1;
    const width = 1480;
    const height = 600;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    this.ctx = ctx;
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, width, height);
    this.saveState();
  }

  setTool(tool: string) {
    this.currentTool = tool;
    this.isTextMode = tool === 'text';
  }

  updateBrushStyle() {
    if (!this.ctx) return;
    this.ctx.strokeStyle = this.currentTool === 'eraser' ? 'white' : this.brushColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  startDrawing(event: MouseEvent) {
    if (this.isTextMode) {
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.textPosition = {
        x: (event.clientX - rect.left) * dpr,
        y: (event.clientY - rect.top) * dpr
      };
      setTimeout(() => this.textInput?.nativeElement.focus(), 0);
      return;
    }

    this.isDrawing = true;
    this.updateBrushStyle();
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.ctx.beginPath();
    this.ctx.moveTo((event.clientX - rect.left) * dpr, (event.clientY - rect.top) * dpr);
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing || this.isTextMode) return;

    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.ctx.lineTo((event.clientX - rect.left) * dpr, (event.clientY - rect.top) * dpr);
    this.ctx.stroke();
  }

  stopDrawing() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.saveState();
    }
  }

  addText() {
    if (!this.currentText.trim()) return;
    this.ctx.font = `${this.brushSize}px Arial`;
    this.ctx.fillStyle = this.brushColor;
    this.ctx.fillText(this.currentText, this.textPosition.x, this.textPosition.y);
    this.currentText = '';
    this.isTextMode = false;
    this.saveState();
  }

  saveState() {
    const imageData = this.ctx.getImageData(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.historyIndex++;
    this.history = this.history.slice(0, this.historyIndex);
    this.history.push(imageData);
  }

  undo() {
    if (!this.canUndo) return;
    this.historyIndex--;
    this.ctx.putImageData(this.history[this.historyIndex], 0, 0);
  }

  redo() {
    if (!this.canRedo) return;
    this.historyIndex++;
    this.ctx.putImageData(this.history[this.historyIndex], 0, 0);
  }

  clearCanvas() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.saveState();
  }

  downloadCanvas() {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.click();
  }

  convertCanvasToPDF() {
    const canvas = this.canvasRef.nativeElement;
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF();

    doc.addImage(imgData, 'PNG', 10, 10, 180, 160);
    doc.save('canvas_to_pdf.pdf');
  }

  saveCanvasData() {
    const canvas = this.canvasRef.nativeElement;
    const imgData = canvas.toDataURL('image/png');
    const data = {
      imgData,
      timestamp: new Date().toISOString()
    };

    this.indexedDbService.saveData(data).then(() => {
      alert('Data saved successfully');
      this.loadCanvasData();
    }).catch(error => {
      console.error('Error saving data to IndexedDB:', error);
      alert('Failed to save data');
    });
  }
  onColorChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.brushColor = target.value;
    }
  }
  
  onSizeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.brushSize = Number(target.value);
    }
  }
  
  loadCanvasData() {
    this.indexedDbService.getAllData().then(data => {
      this.canvasDataList = data;
    }).catch(error => {
      console.error('Error loading data from IndexedDB:', error);
    });
  }
}
