import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagenation',
  imports: [],
  templateUrl: './pagenation.component.html',
  styleUrl: './pagenation.component.css'
})
export class PagenationComponent {
  @Output() prevPage = new EventEmitter();
  @Output() nextPage = new EventEmitter();

  @Input() pageNumber! : number;
  @Input() totalPages! : number;

  onPrev(){
    this.prevPage.emit();
  }

  onNext(){
    this.nextPage.emit();
  }
}
