import { Directive, ElementRef, AfterViewInit, Renderer2, HostListener, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true
})
export class AutofocusDirective implements AfterViewInit, OnDestroy {
  private intervalId: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
      this.aplicarEfectoNeon();
    }, 100);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private aplicarEfectoNeon() {
    let brillo = true;


    this.intervalId = setInterval(() => {
      if (brillo) {
        this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 15px rgba(56, 189, 248, 0.8), 0 0 30px rgba(56, 189, 248, 0.4)');
        this.renderer.setStyle(this.el.nativeElement, 'border-color', '#38bdf8');
        this.renderer.setStyle(this.el.nativeElement, 'background-color', 'rgba(56, 189, 248, 0.05)');
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 5px rgba(56, 189, 248, 0.3)');
        this.renderer.setStyle(this.el.nativeElement, 'border-color', 'rgba(56, 189, 248, 0.5)');
        this.renderer.setStyle(this.el.nativeElement, 'background-color', 'transparent');
      }
      brillo = !brillo;
    }, 800);
  }

  @HostListener('focus') onFocus() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 20px rgba(56, 189, 248, 0.8)');
    this.renderer.setStyle(this.el.nativeElement, 'border-color', '#38bdf8');
  }

  @HostListener('blur') onBlur() {
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', 'none');
    this.renderer.removeStyle(this.el.nativeElement, 'border-color');
    this.renderer.removeStyle(this.el.nativeElement, 'background-color');
  }
}