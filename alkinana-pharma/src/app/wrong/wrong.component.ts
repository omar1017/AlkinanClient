import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-wrong',
  imports: [],
  templateUrl: './wrong.component.html',
  styleUrl: './wrong.component.css'
})
export class WrongComponent implements OnInit {
  @Input() product: any;

  productName : string ='';
  productWrong: string = '';
  imageUrlWrong: string = '';

  constructor( public bsModalRef: BsModalRef){}

  ngOnInit(): void {
    if (this.product) {
      this.productName = this.product.productName;
      this.productWrong = this.product.warning.message;
      this.imageUrlWrong = this.product.warning.image.url;
     }

}
}

export interface Worng{
  productName : string;
  productWrong : string;
  imageUrlWrong : string;
}
