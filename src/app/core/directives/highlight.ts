import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnChanges {
  @Input() appHighlight: boolean = false; 

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.appHighlight) {
      this.renderer.setStyle(this.el.nativeElement, 'background', 'linear-gradient(90deg, rgba(168, 85, 247, 0.2) 0%, rgba(15, 23, 42, 0) 100%)');
      this.renderer.setStyle(this.el.nativeElement, 'border-left', '4px solid #c084fc');
      this.renderer.setStyle(this.el.nativeElement, 'border-top', '1px solid rgba(168, 85, 247, 0.3)');
      this.renderer.setStyle(this.el.nativeElement, 'border-right', '1px solid rgba(168, 85, 247, 0.3)');
      this.renderer.setStyle(this.el.nativeElement, 'border-bottom', '1px solid rgba(168, 85, 247, 0.3)');
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 15px rgba(168, 85, 247, 0.4), inset 0 0 10px rgba(168, 85, 247, 0.1)');

      this.renderer.setAttribute(this.el.nativeElement, 'title', 'Comentario de Administrador');
      
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'background');
      this.renderer.removeStyle(this.el.nativeElement, 'border-left');
      this.renderer.removeStyle(this.el.nativeElement, 'border-top');
      this.renderer.removeStyle(this.el.nativeElement, 'border-right');
      this.renderer.removeStyle(this.el.nativeElement, 'border-bottom');
      this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
      this.renderer.removeAttribute(this.el.nativeElement, 'title');
    }
  }
}