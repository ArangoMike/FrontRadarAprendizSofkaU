import { Directive, ElementRef, Input, OnInit,  Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSemaforizacion]'
})
export class SemaforizacionDirective implements OnInit{

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.resaltar(this.score);
  }

  @Input() score !: number;



   resaltar(score: number){
    console.log('directive :>> ', score);

    if (score >=0 && score <= 3) {
      this.renderer.setAttribute(this.element.nativeElement, 'class', 'status danger');
    }
    if (score >=3.1 && score <= 3.5) {
      this.renderer.setAttribute(this.element.nativeElement, 'class', 'status high');
    }
    if (score >=3.5 && score <= 4.299) {
      this.renderer.setAttribute(this.element.nativeElement, 'class', 'status half');
    }
    if (score >=4.3) {
      this.renderer.setAttribute(this.element.nativeElement, 'class', 'status low');
    }
  }

}
