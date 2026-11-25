import { Directive, ElementRef, HostListener, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appHover]',
  standalone: true
})
export class HoverDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)');
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.setStyle(this.el.nativeElement, 'z-index', '1');
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.05)');
    this.renderer.setStyle(
      this.el.nativeElement, 
      'box-shadow', 
      '0 0 0 2px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(56, 189, 248, 0.6), 0 0 40px rgba(56, 189, 248, 0.4)'
    );
    this.renderer.setStyle(this.el.nativeElement, 'border-color', '#38bdf8');
    this.renderer.setStyle(this.el.nativeElement, 'z-index', '10');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
    this.renderer.removeStyle(this.el.nativeElement, 'border-color');
    this.renderer.setStyle(this.el.nativeElement, 'z-index', '1');
  }
}